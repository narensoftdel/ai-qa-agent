import { Browser, BrowserContext, Page } from 'playwright';

export class BrowserSession {
  constructor(
    public readonly id: string,
    public readonly browser: Browser,
    public readonly context: BrowserContext,
    public readonly page: Page
  ) {}

  private pagesVisited = 0;

  private screenshotsTaken = 0;

  private currentUrl = '';

  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'networkidle'
    });

    this.currentUrl = this.page.url();

    this.pagesVisited++;
  }

  async wait(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  async html(): Promise<string> {
    return this.page.content();
  }

  async url(): Promise<string> {
    return this.page.url();
  }

  incrementScreenshotCount(): void {
    this.screenshotsTaken++;
  }

  getStatistics() {
    return {
      sessionId: this.id,

      currentUrl: this.currentUrl,

      pagesVisited: this.pagesVisited,

      screenshotsTaken: this.screenshotsTaken
    };
  }

  async close(): Promise<void> {
    await this.context.close();

    await this.browser.close();
  }
}
