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

    // checkId ties each header back to its catalog entry so the
    // agent can filter by the user's enabled checks.
    const requiredHeaders = [
      {
        key: 'content-security-policy',
        checkId: 'csp-validation',
        severity: 'HIGH' as const,
        title: 'Missing Content Security Policy'
      },

      {
        key: 'strict-transport-security',
        checkId: 'hsts',
        severity: 'HIGH' as const,
        title: 'Missing HSTS Header'
      },

      {
        key: 'x-frame-options',
        checkId: 'clickjacking',
        severity: 'MEDIUM' as const,
        title: 'Missing X-Frame-Options'
      },

      {
        key: 'x-content-type-options',
        checkId: 'security-headers',
        severity: 'MEDIUM' as const,
        title: 'Missing X-Content-Type-Options'
      },

      {
        key: 'referrer-policy',
        checkId: 'referrer-policy',
        severity: 'LOW' as const,
        title: 'Missing Referrer Policy'
      }
    ];

    for (const header of requiredHeaders) {
      if (!headers[header.key]) {
        findings.push({
          id: randomUUID(),

          checkId: header.checkId,

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

    // Cache-Control: sensitive documents should not be cached.
    const cacheControl = headers['cache-control'] ?? '';

    if (!/no-store|no-cache|private/i.test(cacheControl)) {
      findings.push({
        id: randomUUID(),

        checkId: 'cache-control',

        category: 'HTTP Headers',

        title: 'Missing Cache-Control no-store directive',

        severity: 'LOW',

        page: session.page.url(),

        description:
          'Response does not disable caching. Authenticated or sensitive pages may be stored in shared or browser caches.',

        recommendation: "Set 'Cache-Control: no-store' on authenticated or sensitive responses.",

        evidence: cacheControl || '(cache-control header absent)'
      });
    }

    // Server / X-Powered-By disclose stack details.
    const disclosure = headers['x-powered-by'] ?? headers['server'];

    if (disclosure) {
      findings.push({
        id: randomUUID(),

        checkId: 'server-disclosure',

        category: 'Information Disclosure',

        title: 'Server technology disclosed in headers',

        severity: 'LOW',

        page: session.page.url(),

        description: `Response headers reveal server/framework details: "${disclosure}".`,

        recommendation: 'Remove or obfuscate Server and X-Powered-By headers.',

        evidence: disclosure
      });
    }

    return findings;
  }
}

export const headersCheck = new HeadersCheck();
