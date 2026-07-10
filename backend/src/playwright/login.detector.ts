import { Page } from 'playwright';

export interface LoginElements {
  usernameSelector: string;

  passwordSelector: string;

  submitSelector: string;
}

export class LoginDetector {
  async detect(page: Page): Promise<LoginElements | null> {
    const usernameCandidates = [
      'input[type="email"]',

      'input[type="text"]',

      'input[name="email"]',

      'input[name="username"]',

      'input[name="user"]',

      '#email',

      '#username',

      '#user'
    ];

    const passwordCandidates = ['input[type="password"]', 'input[name="password"]', '#password'];

    const submitCandidates = [
      'button[type="submit"]',

      'input[type="submit"]',

      'button:has-text("Login")',

      'button:has-text("Sign in")',

      'button:has-text("Log in")',

      'button'
    ];

    let usernameSelector = '';
    let passwordSelector = '';
    let submitSelector = '';

    for (const selector of usernameCandidates) {
      if (await page.locator(selector).count()) {
        usernameSelector = selector;

        break;
      }
    }

    for (const selector of passwordCandidates) {
      if (await page.locator(selector).count()) {
        passwordSelector = selector;

        break;
      }
    }

    for (const selector of submitCandidates) {
      if (await page.locator(selector).count()) {
        submitSelector = selector;

        break;
      }
    }

    if (!usernameSelector || !passwordSelector || !submitSelector) {
      return null;
    }

    return {
      usernameSelector,

      passwordSelector,

      submitSelector
    };
  }
}

export const loginDetector = new LoginDetector();
