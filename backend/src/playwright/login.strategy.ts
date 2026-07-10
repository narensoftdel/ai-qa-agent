import { BrowserSession } from './browser.session.js';
import { LoginConfig, LoginStrategy } from './login.types.js';
import { loginDetector } from './login.detector.js';

export class FormLoginStrategy implements LoginStrategy {
  async login(session: BrowserSession, config: LoginConfig): Promise<void> {
    await session.goto(config.url);

    const elements = await loginDetector.detect(session.page);

    if (!elements) {
      throw new Error('Unable to detect login form.');
    }

    await session.page.fill(elements.usernameSelector, config.username);

    await session.page.fill(elements.passwordSelector, config.password);

    await session.page.click(elements.submitSelector);

    await session.page.waitForLoadState('networkidle');
  }
}
