import { chromium, firefox, webkit, BrowserType } from 'playwright';
import { randomUUID } from 'crypto';
import { BrowserSession } from './browser.session';
import { logger } from '../config/logger.js';

export interface LaunchBrowserOptions {
  browser?: 'chromium' | 'firefox' | 'webkit';

  headless?: boolean;

  slowMo?: number;
}

export class BrowserService {
  private getBrowser(type: string): BrowserType {
    switch (type) {
      case 'firefox':
        return firefox;

      case 'webkit':
        return webkit;

      default:
        return chromium;
    }
  }

  async launch(options: LaunchBrowserOptions = {}): Promise<BrowserSession> {
    const browserType = this.getBrowser(options.browser ?? 'chromium');

    logger.info(`Launching ${options.browser ?? 'chromium'} browser`);

    const browser = await browserType.launch({
      headless: options.headless ?? true,

      slowMo: options.slowMo ?? 100
    });

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: {
        width: 1600,

        height: 900
      }
    });

    const page = await context.newPage();

    page.setDefaultTimeout(30000);

    return new BrowserSession(
      randomUUID(),

      browser,

      context,

      page
    );
  }
}

export const browserService = new BrowserService();
