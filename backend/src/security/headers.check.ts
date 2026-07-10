import { randomUUID } from 'crypto';
import { BrowserSession } from '../playwright/browser.session.js';
import { SecurityFinding } from './security.types.js';

export class HeadersCheck {
  async execute(session: BrowserSession, targetUrl?: string): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];

    const response = await session.page.goto(targetUrl ?? session.page.url(), {
      waitUntil: 'networkidle'
    });

    if (!response) {
      return findings;
    }

    const headers = response.headers();

    const requiredHeaders = [
      {
        key: 'content-security-policy',
        severity: 'HIGH' as const,
        title: 'Missing Content Security Policy'
      },

      {
        key: 'strict-transport-security',
        severity: 'HIGH' as const,
        title: 'Missing HSTS Header'
      },

      {
        key: 'x-frame-options',
        severity: 'MEDIUM' as const,
        title: 'Missing X-Frame-Options'
      },

      {
        key: 'x-content-type-options',
        severity: 'MEDIUM' as const,
        title: 'Missing X-Content-Type-Options'
      },

      {
        key: 'referrer-policy',
        severity: 'LOW' as const,
        title: 'Missing Referrer Policy'
      }
    ];

    for (const header of requiredHeaders) {
      if (!headers[header.key]) {
        findings.push({
          id: randomUUID(),

          category: 'HTTP Headers',

          title: header.title,

          severity: header.severity,

          page: session.page.url(),

          description: `${header.key} header is missing.`,

          recommendation: `Configure ${header.key} on the web server.`,

          evidence: header.key
        });
      }
    }

    return findings;
  }
}

export const headersCheck = new HeadersCheck();
