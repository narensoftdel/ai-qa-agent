import { BrowserSession } from './browser.session.js';
import { browserService } from './browser.service.js';
import { BrowserLaunchRequest } from './browser.types.js';
import { logger } from '../config/logger.js';

export class BrowserManager {
  private readonly sessions = new Map<string, BrowserSession>();

  async createSession(options: BrowserLaunchRequest = {}): Promise<BrowserSession> {
    const session = await browserService.launch({
      browser: options.browser,
      headless: options.headless,
      slowMo: options.slowMo
    });

    this.sessions.set(session.id, session);

    logger.info(`Browser Session Created : ${session.id}`);

    return session;
  }

  getSession(id: string): BrowserSession | undefined {
    return this.sessions.get(id);
  }

  getAllSessions(): BrowserSession[] {
    return [...this.sessions.values()];
  }

  async closeSession(id: string): Promise<void> {
    const session = this.sessions.get(id);

    if (!session) {
      return;
    }

    await session.close();

    this.sessions.delete(id);

    logger.info(`Browser Session Closed : ${id}`);
  }

  async closeAllSessions(): Promise<void> {
    for (const session of this.sessions.values()) {
      await session.close();
    }

    this.sessions.clear();

    logger.info('All Browser Sessions Closed');
  }

  activeSessions(): number {
    return this.sessions.size;
  }
}

export const browserManager = new BrowserManager();
