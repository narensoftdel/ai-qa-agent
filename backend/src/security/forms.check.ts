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

          checkId: 'forms-get',

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

          checkId: 'password-http',

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

          checkId: 'autocomplete-sensitive',

          category: 'Forms',

          title: 'Password autocomplete enabled',

          severity: 'LOW',

          page: session.page.url(),

          description: 'Password field allows browser autocomplete.',

          recommendation: 'Review whether autocomplete should be disabled.',

          evidence: 'autocomplete="on"'
        });
      }

      // CSRF token: state-changing (POST) forms should carry an
      // anti-forgery token as a hidden field.
      if (method.toUpperCase() === 'POST') {
        const hasCsrfToken = await form.$$eval('input[type="hidden"]', inputs =>
          inputs.some(input => {
            const name = (input.getAttribute('name') ?? '').toLowerCase();

            return /csrf|xsrf|_token|authenticity/.test(name);
          })
        );

        if (!hasCsrfToken) {
          findings.push({
            id: randomUUID(),

            checkId: 'csrf-token',

            category: 'CSRF',

            title: 'POST form without CSRF token',

            severity: 'MEDIUM',

            page: session.page.url(),

            description: 'A state-changing form has no recognizable anti-CSRF hidden token field.',

            recommendation:
              'Include a per-session CSRF token in the form and validate it server-side.',

            evidence: action ?? ''
          });
        }
      }
    }

    return findings;
  }
}

export const formsCheck = new FormsCheck();
