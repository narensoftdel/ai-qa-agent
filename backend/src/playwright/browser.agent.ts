import { logger } from '../config/logger.js';
import { BrowserSession } from './browser.session.js';
import { browserManager } from './browser.manager.js';
import {
  BrowserAgentResponse,
  BrowserLaunchRequest,
  BrowserNavigationResult,
  BrowserOpenRequest
} from './browser.types.js';

export class BrowserAgent {
  async launch(options: BrowserLaunchRequest = {}): Promise<BrowserAgentResponse> {
    const session = await browserManager.createSession(options);

    return {
      success: true,
      message: 'Browser launched successfully.',
      session
    };
  }

  async open(request: BrowserOpenRequest): Promise<BrowserAgentResponse> {
    const session = await browserManager.createSession(request);

    logger.info(`Opening URL : ${request.url}`);

    await session.goto(request.url);

    return {
      success: true,
      message: 'Application opened successfully.',
      session
    };
  }

  async navigate(session: BrowserSession, url: string): Promise<BrowserNavigationResult> {
    logger.info(`Navigating : ${url}`);

    await session.goto(url);

    return {
      success: true,
      url: await session.url(),
      title: await session.title()
    };
  }

  async refresh(session: BrowserSession): Promise<void> {
    await session.page.reload({
      waitUntil: 'networkidle'
    });
  }

  async close(session: BrowserSession): Promise<void> {
    logger.info(`Closing Browser Session : ${session.id}`);

    await browserManager.closeSession(session.id);
  }

  statistics(session: BrowserSession) {
    return session.getStatistics();
  }
}

export const browserAgent = new BrowserAgent();
