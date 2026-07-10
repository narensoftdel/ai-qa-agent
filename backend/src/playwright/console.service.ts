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
  }

  getLogs(): BrowserConsoleLog[] {
    return this.logs;
  }

  clear(): void {
    this.logs.length = 0;
  }
}

export const consoleService = new ConsoleService();
