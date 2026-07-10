import { randomUUID } from 'crypto';
import { BrowserSession } from '../playwright/browser.session.js';
import { SecurityFinding } from './security.types.js';

export class FormsCheck {
  async execute(session: BrowserSession, targetUrl?: string): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    if (targetUrl && targetUrl !== session.page.url()) {
      await session.page.goto(targetUrl, {
        waitUntil: 'networkidle'
      });
    }

    const forms = await session.page.$$('form');

    for (const form of forms) {
      const action = await form.getAttribute('action');

      const method = (await form.getAttribute('method')) ?? 'GET';

      if (method.toUpperCase() === 'GET') {
        findings.push({
          id: randomUUID(),

          category: 'Forms',

          title: 'Form submits using GET',

          severity: 'LOW',

          page: session.page.url(),

          description: 'Sensitive information may appear in URL.',

          recommendation: 'Use POST for authentication or sensitive forms.',

          evidence: action ?? ''
        });
      }

      const passwordField = await form.$('input[type="password"]');

      if (passwordField && !session.page.url().startsWith('https://')) {
        findings.push({
          id: randomUUID(),

          category: 'Forms',

          title: 'Password transmitted over HTTP',

          severity: 'CRITICAL',

          page: session.page.url(),

          description: 'Password form is not protected by HTTPS.',

          recommendation: 'Serve the application over HTTPS.',

          evidence: session.page.url()
        });
      }

      const autocomplete = await form.$$eval('input[type="password"]', inputs =>
        inputs.map(input => input.getAttribute('autocomplete'))
      );

      if (autocomplete.includes('on')) {
        findings.push({
          id: randomUUID(),

          category: 'Forms',

          title: 'Password autocomplete enabled',

          severity: 'LOW',

          page: session.page.url(),

          description: 'Password field allows browser autocomplete.',

          recommendation: 'Review whether autocomplete should be disabled.',

          evidence: 'autocomplete="on"'
        });
      }
    }

    return findings;
  }
}

export const formsCheck = new FormsCheck();
