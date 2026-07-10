import { Page } from 'playwright';
import { BrowserSession } from '../playwright/browser.session.js';
import { logger } from '../config/logger.js';

export interface CrawledPage {
  title: string;

  url: string;
}

export class CrawlerService {
  private readonly visited = new Set<string>();

  /**
   * Discover all internal pages up to the given breadth/depth limits.
   */
  async crawl(session: BrowserSession, maxPages = 50, maxDepth = 3): Promise<CrawledPage[]> {
    const pages: CrawledPage[] = [];

    const baseUrl = new URL(session.page.url()).origin;

    await this.visitPage(session.page, baseUrl, pages, maxPages, maxDepth, 0);

    logger.info(`Discovered ${pages.length} pages`);

    return pages;
  }

  /**
   * Recursive crawler bounded by page count and link depth.
   */
  private async visitPage(
    page: Page,
    baseUrl: string,
    pages: CrawledPage[],
    maxPages: number,
    maxDepth: number,
    depth: number
  ): Promise<void> {
    const currentUrl = page.url();

    if (this.visited.has(currentUrl)) {
      return;
    }

    if (pages.length >= maxPages) {
      return;
    }

    this.visited.add(currentUrl);

    logger.info(`Scanning ${currentUrl} (depth ${depth})`);

    pages.push({
      title: await page.title(),

      url: currentUrl
    });

    // Stop descending once the depth budget is spent, but the
    // current page is still recorded above.
    if (depth >= maxDepth) {
      return;
    }

    const links = await page.$$eval(
      'a[href]',

      anchors => anchors.map(anchor => (anchor as HTMLAnchorElement).href)
    );

    for (const href of links) {
      if (pages.length >= maxPages) {
        break;
      }

      // Drop hashes / query strings so /page and /page#x are one page
      const normalized = this.normalize(href);

      if (!normalized.startsWith(baseUrl)) {
        continue;
      }

      if (this.visited.has(normalized)) {
        continue;
      }

      try {
        await page.goto(normalized, {
          waitUntil: 'networkidle'
        });

        await this.visitPage(
          page,

          baseUrl,

          pages,

          maxPages,

          maxDepth,

          depth + 1
        );
      } catch (error) {
        logger.warn(`Unable to visit ${normalized}`);
      }
    }
  }

  private normalize(href: string): string {
    try {
      const url = new URL(href);

      url.hash = '';

      return url.toString();
    } catch {
      return href;
    }
  }

  clear(): void {
    this.visited.clear();
  }
}

export const crawlerService = new CrawlerService();
