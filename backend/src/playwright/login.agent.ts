import { BrowserSession } from './browser.session.js';
import { LoginConfig } from './login.types.js';
import { loginDetector } from './login.detector.js';
import { logger } from '../config/logger.js';

export class LoginAgent {
  async login(
    session: BrowserSession,

    config: LoginConfig
  ): Promise<void> {
    logger.info('Attempting automatic login detection...');

    await session.goto(config.url);

    const elements = await loginDetector.detect(session.page);

    if (!elements) {
      throw new Error('Unable to detect login form.');
    }

    logger.info(`Username Field : ${elements.usernameSelector}`);
    logger.info(`Password Field : ${elements.passwordSelector}`);
    logger.info(`Submit Button  : ${elements.submitSelector}`);

    await session.page.fill(
      elements.usernameSelector,

      config.username
    );

    await session.page.fill(
      elements.passwordSelector,

      config.password
    );

    await session.page.click(elements.submitSelector);

    await session.page.waitForLoadState('networkidle');

    logger.info('Login successful.');
  }
}

export const loginAgent = new LoginAgent();
