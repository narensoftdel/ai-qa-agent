import { Page } from 'playwright';
import { BrowserSession } from './browser.session.js';
import { logger } from '../config/logger.js';

export interface NavigationLink {
  text: string;

  href: string;
}

export interface NavigationResult {
  url: string;

  title: string;

  links: NavigationLink[];
}

export class NavigationService {
  async discover(session: BrowserSession): Promise<NavigationResult> {
    logger.info('Discovering navigation');

    const page: Page = session.page;

    const links = await page.$$eval(
      'a[href]',

      elements =>
        elements.map(link => ({
          text: (link.textContent || '').trim(),

          href: (link as HTMLAnchorElement).href
        }))
    );

    return {
      url: page.url(),

      title: await page.title(),

      links
    };
  }

  async click(
    session: BrowserSession,

    selector: string
  ): Promise<void> {
    logger.info(`Clicking ${selector}`);

    await session.page.click(selector);

    await session.page.waitForLoadState('networkidle');
  }
}

export const navigationService = new NavigationService();
