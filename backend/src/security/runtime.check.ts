import { randomUUID } from 'crypto';

import { SecurityFinding } from './security.types.js';
import { NetworkRequest } from '../playwright/network.service.js';
import { BrowserConsoleLog } from '../playwright/console.service.js';
import { PageContext } from '../playwright/page-context.service.js';

export interface RuntimeCheckInput {
  requests: NetworkRequest[];

  consoleErrors: BrowserConsoleLog[];

  pageContexts: PageContext[];
}

/**
 * Category 1 checks derived from data captured across the whole scan.
 * Every finding is tagged with its catalog checkId so the agent can
 * drop the ones the user disabled.
 */
export class RuntimeCheck {
  private static readonly SECRET_KEY_PATTERN =
    /token|secret|password|passwd|apikey|api_key|auth|jwt|credential|private/i;

  private static readonly SECRET_VALUE_PATTERN =
    /^(eyJ[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{20,}|ghp_[A-Za-z0-9]{20,})/;

  execute(input: RuntimeCheckInput): SecurityFinding[] {
    return [
      ...this.consoleAndErrorFindings(input.consoleErrors),

      ...this.httpStatusFindings(input.requests),

      ...this.mixedContentFindings(input.requests, input.pageContexts),

      ...this.storageSecretFindings(input.pageContexts)
    ];
  }

  /**
   * The console service records page errors and failed loads as
   * `error` logs. Route them to the right catalog check by text shape:
   * "Failed to load ..." -> broken-links, others -> console-errors.
   * (JS exceptions also arrive here and map to js-exceptions.)
   */
  private consoleAndErrorFindings(errors: BrowserConsoleLog[]): SecurityFinding[] {
    const seen = new Set<string>();

    const findings: SecurityFinding[] = [];

    for (const error of errors) {
      if (seen.has(error.text)) {
        continue;
      }

      seen.add(error.text);

      const isBrokenLink = /^Failed to load /i.test(error.text);

      const isException = /uncaught|is not defined|is not a function|cannot read/i.test(error.text);

      if (isBrokenLink) {
        findings.push({
          id: randomUUID(),
          checkId: 'broken-links',
          category: 'Broken Links',
          title: 'Resource failed to load',
          severity: 'MEDIUM',
          page: '',
          description: 'A resource or link failed to load during the scan.',
          recommendation: 'Fix or remove the broken resource/link.',
          evidence: error.text.slice(0, 500)
        });
      } else if (isException) {
        findings.push({
          id: randomUUID(),
          checkId: 'js-exceptions',
          category: 'JavaScript Errors',
          title: 'Uncaught JavaScript exception',
          severity: 'MEDIUM',
          page: '',
          description: 'An unhandled exception was thrown on the page.',
          recommendation: 'Add error handling and fix the failing code path.',
          evidence: error.text.slice(0, 500)
        });
      } else {
        findings.push({
          id: randomUUID(),
          checkId: 'console-errors',
          category: 'Console Errors',
          title: 'Browser console error',
          severity: 'LOW',
          page: '',
          description: 'The page logged an error to the browser console.',
          recommendation: 'Investigate and resolve the underlying console error.',
          evidence: error.text.slice(0, 500)
        });
      }
    }

    return findings;
  }

  private httpStatusFindings(requests: NetworkRequest[]): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    const seen = new Set<string>();

    for (const request of requests) {
      if (request.status === undefined) {
        continue;
      }

      if (request.status >= 400 && !seen.has(request.url)) {
        seen.add(request.url);

        const isServerError = request.status >= 500;

        findings.push({
          id: randomUUID(),
          checkId: 'api-status',
          category: 'API / HTTP Status',
          title: `HTTP ${request.status} response`,
          severity: isServerError ? 'HIGH' : 'MEDIUM',
          page: request.url,
          description: `${request.method} ${request.url} returned status ${request.status}.`,
          recommendation: isServerError
            ? 'Investigate the server error; 5xx responses indicate a backend failure.'
            : 'Verify the request is expected; 4xx may indicate broken links or authorization gaps.',
          evidence: `${request.method} ${request.url} -> ${request.status}`
        });
      }
    }

    return findings;
  }

  private mixedContentFindings(
    requests: NetworkRequest[],
    pageContexts: PageContext[]
  ): SecurityFinding[] {
    const httpsPages = pageContexts.filter(context => context.url.startsWith('https://'));

    if (httpsPages.length === 0) {
      return [];
    }

    const findings: SecurityFinding[] = [];

    const seen = new Set<string>();

    for (const request of requests) {
      if (
        request.url.startsWith('http://') &&
        !request.url.startsWith('http://localhost') &&
        !seen.has(request.url)
      ) {
        seen.add(request.url);

        findings.push({
          id: randomUUID(),
          checkId: 'mixed-content',
          category: 'Mixed Content',
          title: 'Insecure resource loaded over HTTP',
          severity: 'MEDIUM',
          page: httpsPages[0].url,
          description:
            'An HTTPS page loaded a sub-resource over plain HTTP, weakening transport security.',
          recommendation: 'Serve all sub-resources over HTTPS.',
          evidence: request.url
        });
      }
    }

    return findings;
  }

  private storageSecretFindings(pageContexts: PageContext[]): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    const seen = new Set<string>();

    for (const context of pageContexts) {
      const stores: Array<['localStorage' | 'sessionStorage', Record<string, string>]> = [
        ['localStorage', context.localStorage],
        ['sessionStorage', context.sessionStorage]
      ];

      for (const [storeName, store] of stores) {
        for (const [key, value] of Object.entries(store)) {
          const looksSecret =
            RuntimeCheck.SECRET_KEY_PATTERN.test(key) ||
            RuntimeCheck.SECRET_VALUE_PATTERN.test(value);

          const dedupeKey = `${storeName}:${key}`;

          if (looksSecret && !seen.has(dedupeKey)) {
            seen.add(dedupeKey);

            findings.push({
              id: randomUUID(),
              checkId: 'storage-secrets',
              category: 'Sensitive Data Storage',
              title: `Possible secret in ${storeName}`,
              severity: 'HIGH',
              page: context.url,
              description: `${storeName} key "${key}" appears to hold a token or credential, which is exposed to any JavaScript / XSS on the page.`,
              recommendation:
                'Store session tokens in HttpOnly cookies instead of localStorage/sessionStorage.',
              evidence: `${storeName}["${key}"]`
            });
          }
        }
      }
    }

    return findings;
  }
}

export const runtimeCheck = new RuntimeCheck();
