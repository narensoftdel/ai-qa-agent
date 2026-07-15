import { randomUUID } from 'crypto';
import { BrowserSession } from '../playwright/browser.session.js';
import { SecurityFinding } from './security.types.js';

export class CookiesCheck {
  async execute(session: BrowserSession): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    const cookies = await session.context.cookies();

    for (const cookie of cookies) {
      if (!cookie.secure) {
        findings.push({
          id: randomUUID(),

          checkId: 'cookie-flags',

          category: 'Cookies',

          title: `Cookie "${cookie.name}" missing Secure flag`,

          severity: 'HIGH',

          page: session.page.url(),

          description: 'Cookie can be transmitted over HTTP.',

          recommendation: 'Enable Secure flag.',

          evidence: cookie.name
        });
      }

      if (!cookie.httpOnly) {
        findings.push({
          id: randomUUID(),

          checkId: 'cookie-flags',

          category: 'Cookies',

          title: `Cookie "${cookie.name}" missing HttpOnly flag`,

          severity: 'HIGH',

          page: session.page.url(),

          description: 'Cookie is accessible from JavaScript.',

          recommendation: 'Enable HttpOnly flag.',

          evidence: cookie.name
        });
      }

      if (cookie.sameSite === 'None' && !cookie.secure) {
        findings.push({
          id: randomUUID(),

          checkId: 'cookie-flags',

          category: 'Cookies',

          title: `Cookie "${cookie.name}" SameSite=None without Secure`,

          severity: 'MEDIUM',

          page: session.page.url(),

          description: 'SameSite=None cookies should also be Secure.',

          recommendation: 'Configure Secure with SameSite=None.',

          evidence: cookie.name
        });
      }
    }

    return findings;
  }
}

export const cookiesCheck = new CookiesCheck();
