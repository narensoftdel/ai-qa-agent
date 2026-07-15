import { scannerService } from '../services/scanner.service.js';

import { browserAgent } from '../playwright/browser.agent.js';
import { loginAgent } from '../playwright/login.agent.js';
import { navigationService } from '../playwright/navigation.service.js';
import { screenshotService } from '../playwright/screenshot.service.js';
import { networkService } from '../playwright/network.service.js';
import { consoleService } from '../playwright/console.service.js';
import { storageService } from '../playwright/storage.service.js';

import { headersCheck } from '../security/headers.check.js';
import { cookiesCheck } from '../security/cookies.check.js';
import { formsCheck } from '../security/forms.check.js';
import { runtimeCheck } from '../security/runtime.check.js';
import { SecurityFinding } from '../security/security.types.js';
import { CHECK_CATALOG } from '../security/check-catalog.js';

import { pageContextService, PageContext } from '../playwright/page-context.service.js';

import { reportService } from '../reports/report.service.js';

import { logger } from '../config/logger.js';
import { aiService } from '../ai/ai.service.js';
import { crawlerService } from '../services/crawler.service.js';
import { settingsService } from '../services/settings.service.js';

// Finding categories produced by the runtime check, used to group
// findings back into runtime.json for the artifact readers.
const runtimeCheckCategories = new Set([
  'Console Errors',
  'JavaScript Errors',
  'Broken Links',
  'API / HTTP Status',
  'Mixed Content',
  'Sensitive Data Storage'
]);

export class AgentManager {
  async start(scanId: string): Promise<void> {
    const scan = scannerService.getScan(scanId);

    if (!scan) {
      logger.error(`Scan not found : ${scanId}`);
      return;
    }

    let browserSession: any = null;

    // Resolve enabled checks from global settings.
    const appSettings = settingsService.get();

    const enabledChecks = new Set(appSettings.enabledChecks);

    const enabledAiChecks = CHECK_CATALOG.filter(
      check => check.category === 'category2' && enabledChecks.has(check.id)
    ).map(check => check.id);

    const runAiChecks = appSettings.aiEnabled && enabledAiChecks.length > 0;

    // Warnings surfaced to the report (e.g. AI skipped).
    const warnings: string[] = [];

    try {
      //--------------------------------------------------
      // Start Scan
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        status: 'RUNNING',

        progress: 5,

        currentStep: 'Launching Browser',

        startedAt: new Date()
      });

      //--------------------------------------------------
      // Launch Browser
      //--------------------------------------------------

      browserSession = await browserAgent.launch({
        headless: true
      });

      //--------------------------------------------------
      // Start Capturing Browser Activity
      //
      // Listeners must attach before the first navigation,
      // otherwise console/network events from the initial
      // page load are lost.
      //--------------------------------------------------

      networkService.start(browserSession.session);

      consoleService.start(browserSession.session);

      await browserAgent.navigate(browserSession.session, scan.url);

      //--------------------------------------------------
      // Login (Optional)
      //--------------------------------------------------

      if (scan.username && scan.password) {
        scannerService.updateScan(scanId, {
          progress: 15,

          currentStep: 'Logging In'
        });

        await loginAgent.login(
          browserSession.session,

          {
            url: scan.url,

            username: scan.username,

            password: scan.password
          }
        );
      }

      //--------------------------------------------------
      // Discover Pages
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        progress: 30,

        currentStep: 'Discovering Navigation'
      });

      crawlerService.clear();

      const pages = await crawlerService.crawl(
        browserSession.session,

        scan.maxPages,

        scan.maxDepth
      );

      storageService.saveJson(
        scanId,

        'pages.json',

        pages
      );

      //--------------------------------------------------
      // Audit Each Discovered Page
      //
      // Header + form checks run per page and are tagged with
      // that page's URL. A screenshot is captured per page.
      //--------------------------------------------------

      const headerFindings: SecurityFinding[] = [];

      const formFindings: SecurityFinding[] = [];

      const aiFindings: SecurityFinding[] = [];

      const pageContexts: PageContext[] = [];

      const screenshots: Array<{ url: string; path: string }> = [];

      let firstScreenshot = '';

      let aiSkipped = false;

      for (let index = 0; index < pages.length; index++) {
        const target = pages[index];

        // Progress from 40% (crawl done) to 80% (checks done)
        const progress = 40 + Math.round(((index + 1) / pages.length) * 40);

        scannerService.updateScan(scanId, {
          progress,

          currentStep: `Auditing`,

          pagesScanned: index + 1
        });

        try {
          // headersCheck navigates to the page; run it first so the
          // remaining per-page work operates on the loaded page.
          const pageHeaders = await headersCheck.execute(browserSession.session, target.url);

          const pageForms = await formsCheck.execute(browserSession.session, target.url);

          headerFindings.push(...pageHeaders);

          formFindings.push(...pageForms);

          // Snapshot page content for the storage-secret runtime check
          // and the AI (Category 2) review.
          const context = await pageContextService.capture(browserSession.session);

          pageContexts.push(context);

          // Category 2 — AI reasoning over this page, if enabled.
          if (runAiChecks) {
            const result = await aiService.analyzePage(context, enabledAiChecks);

            if (result.skipped) {
              aiSkipped = true;
            } else {
              aiFindings.push(...result.findings);
            }
          }

          const screenshotPath = await screenshotService.capture(
            browserSession.session,
            `page-${index}`
          );

          screenshots.push({
            url: target.url,
            path: screenshotPath
          });

          if (!firstScreenshot) {
            firstScreenshot = screenshotPath;
          }
        } catch (pageError) {
          logger.warn(
            `Failed auditing ${target.url}: ${
              pageError instanceof Error ? pageError.message : pageError
            }`
          );
        }
      }

      if (runAiChecks && aiSkipped) {
        warnings.push(
          'AI (Category 2) checks were enabled but OpenAI was unavailable (missing key or quota); those checks were skipped.'
        );
      }

      //--------------------------------------------------
      // Cookie Check (per domain, run once)
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        progress: 82,

        currentStep: 'Checking Cookies'
      });

      const cookieFindings = await cookiesCheck.execute(browserSession.session);

      storageService.saveJson(scanId, 'screenshots.json', screenshots);

      //--------------------------------------------------
      // Runtime Checks (once, over all captured data)
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        progress: 86,

        currentStep: 'Analyzing Runtime Behavior'
      });

      const networkLogs = networkService.getRequests();

      const consoleLogs = consoleService.getLogs();

      const runtimeFindings = runtimeCheck.execute({
        requests: networkLogs,

        consoleErrors: consoleService.getErrors(),

        pageContexts
      });

      //--------------------------------------------------
      // Collect Logs
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        progress: 90,

        currentStep: 'Saving Scan Results'
      });

      const screenshot = firstScreenshot;

      //--------------------------------------------------
      // Filter every finding by the user's enabled checks.
      //--------------------------------------------------

      const rawFindings = [
        ...headerFindings,
        ...cookieFindings,
        ...formFindings,
        ...runtimeFindings,
        ...aiFindings
      ];

      const allFindings = rawFindings.filter(finding => enabledChecks.has(finding.checkId));

      const totalFindings = allFindings.length;

      //--------------------------------------------------
      // Save Artifacts
      //--------------------------------------------------
      const navigation = await navigationService.discover(browserSession.session);

      storageService.saveJson(scanId, 'navigation.json', navigation);

      storageService.saveJson(scanId, 'network.json', networkLogs);

      storageService.saveJson(scanId, 'console.json', consoleLogs);

      // Persist findings grouped so the report/artifact readers still work.
      storageService.saveJson(
        scanId,
        'headers.json',
        allFindings.filter(
          f => f.category === 'HTTP Headers' || f.category === 'Information Disclosure'
        )
      );

      storageService.saveJson(
        scanId,
        'cookies.json',
        allFindings.filter(f => f.category === 'Cookies')
      );

      storageService.saveJson(
        scanId,
        'forms.json',
        allFindings.filter(f => f.category === 'Forms' || f.category === 'CSRF')
      );

      storageService.saveJson(
        scanId,
        'runtime.json',
        allFindings.filter(f => runtimeCheckCategories.has(f.category))
      );

      storageService.saveJson(
        scanId,
        'ai-findings.json',
        allFindings.filter(f => f.category.startsWith('AI:'))
      );

      const aiAnalysis = await aiService.analyze(allFindings);

      storageService.saveJson(scanId, 'ai-analysis.json', aiAnalysis);

      storageService.saveJson(scanId, 'summary.json', {
        url: scan.url,

        screenshot,

        screenshots,

        totalFindings,

        pagesDiscovered: pages.length,

        pagesScanned: pages.length,

        enabledChecks: appSettings.enabledChecks,

        warnings,

        completedAt: new Date()
      });

      //--------------------------------------------------
      // Generate HTML Report
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        progress: 95,

        currentStep: 'Generating HTML Report'
      });

      const reportPath = reportService.generate(scanId);

      logger.info(`HTML Report : ${reportPath}`);

      //--------------------------------------------------
      // Complete Scan
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        status: 'COMPLETED',

        progress: 100,

        currentStep: 'Completed',

        completedAt: new Date(),

        findings: totalFindings
      });

      logger.info(`Scan Completed : ${scanId}`);
    } catch (error) {
      logger.error(error);

      scannerService.updateScan(scanId, {
        status: 'FAILED',

        currentStep: 'Failed',

        completedAt: new Date(),

        error: error instanceof Error ? error.message : 'Unknown Error'
      });
    } finally {
      networkService.clear();
      consoleService.clear();

      if (browserSession) {
        await browserAgent.close(browserSession.session);
      }
    }
  }
}

export const agentManager = new AgentManager();
