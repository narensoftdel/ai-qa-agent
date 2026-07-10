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
import { SecurityFinding } from '../security/security.types.js';

import { reportService } from '../reports/report.service.js';

import { logger } from '../config/logger.js';
import { aiService } from '../ai/ai.service.js';
import { crawlerService } from '../services/crawler.service.js';

export class AgentManager {
  async start(scanId: string): Promise<void> {
    const scan = scannerService.getScan(scanId);

    if (!scan) {
      logger.error(`Scan not found : ${scanId}`);
      return;
    }

    let browserSession: any = null;

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

      const screenshots: Array<{ url: string; path: string }> = [];

      let firstScreenshot = '';

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
      // Collect Logs
      //--------------------------------------------------

      scannerService.updateScan(scanId, {
        progress: 90,

        currentStep: 'Saving Scan Results'
      });

      const screenshot = firstScreenshot;

      const networkLogs = networkService.getRequests();

      const consoleLogs = consoleService.getLogs();

      //--------------------------------------------------
      // Save Artifacts
      //--------------------------------------------------
      const navigation = await navigationService.discover(browserSession.session);

      storageService.saveJson(scanId, 'navigation.json', navigation);

      storageService.saveJson(scanId, 'network.json', networkLogs);

      storageService.saveJson(scanId, 'console.json', consoleLogs);

      storageService.saveJson(scanId, 'headers.json', headerFindings);

      storageService.saveJson(scanId, 'cookies.json', cookieFindings);

      storageService.saveJson(scanId, 'forms.json', formFindings);

      const allFindings = [...headerFindings, ...cookieFindings, ...formFindings];

      const totalFindings = allFindings.length;

      const aiAnalysis = await aiService.analyze(allFindings);

      storageService.saveJson(scanId, 'ai-analysis.json', aiAnalysis);

      storageService.saveJson(scanId, 'summary.json', {
        url: scan.url,

        screenshot,

        screenshots,

        totalFindings,

        pagesDiscovered: pages.length,

        pagesScanned: pages.length,

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
