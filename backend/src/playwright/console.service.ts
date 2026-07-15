import { BrowserSession } from './browser.session.js';
import { logger } from '../config/logger.js';

export interface BrowserConsoleLog {
  type: string;

  text: string;
}

export class ConsoleService {
  private readonly logs: BrowserConsoleLog[] = [];

  start(session: BrowserSession): void {
    logger.info('Capturing browser console');

    session.page.on('console', message => {
      this.logs.push({
        type: message.type(),

        text: message.text()
      });
    });

    // Uncaught exceptions do not emit a 'console' event even though
    // DevTools shows them as errors, so capture them separately.
    session.page.on('pageerror', error => {
      this.logs.push({
        type: 'error',

        text: error.message
      });
    });

    // Failed resource loads (404s, blocked requests, DNS failures)
    // also surface as errors in DevTools.
    session.page.on('requestfailed', request => {
      this.logs.push({
        type: 'error',

        text: `Failed to load ${request.url()} : ${request.failure()?.errorText ?? 'unknown error'}`
      });
    });
  }

  getLogs(): BrowserConsoleLog[] {
    return this.logs;
  }

  /** Console entries of type `error` (includes page errors / failed loads). */
  getErrors(): BrowserConsoleLog[] {
    return this.logs.filter(log => log.type === 'error');
  }

  clear(): void {
    this.logs.length = 0;
  }
}

export const consoleService = new ConsoleService();
