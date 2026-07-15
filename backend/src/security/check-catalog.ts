/**
 * Single source of truth for every security checkpoint the platform
 * knows about. The frontend Settings page and the backend scan engine
 * both key off these IDs so an enabled/disabled preference means the
 * same thing on both sides.
 *
 * `implemented: false` items are shown in the UI (greyed, "Coming soon")
 * but can never be enabled, and the engine ignores them.
 */

export type CheckCategory = 'category1' | 'category2';

export interface CheckDefinition {
  /** Stable identifier used in settings and findings. */
  id: string;

  /** Human-readable label shown in Settings. */
  label: string;

  /** category1 = rule-based automatable, category2 = AI-assisted. */
  category: CheckCategory;

  /** Whether the engine can actually run this today. */
  implemented: boolean;

  /** Short description for the Settings UI. */
  description: string;
}

export const CHECK_CATALOG: CheckDefinition[] = [
  // ---------------- Category 1 — rule-based ----------------
  {
    id: 'security-headers',
    label: 'Missing security headers',
    category: 'category1',
    implemented: true,
    description:
      'Detects absent CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.'
  },
  {
    id: 'cookie-flags',
    label: 'Cookie flags (Secure, HttpOnly, SameSite)',
    category: 'category1',
    implemented: true,
    description: 'Flags cookies missing Secure/HttpOnly or using unsafe SameSite settings.'
  },
  {
    id: 'csp-validation',
    label: 'CSP validation',
    category: 'category1',
    implemented: true,
    description: 'Checks for a Content-Security-Policy header (presence).'
  },
  {
    id: 'hsts',
    label: 'HSTS',
    category: 'category1',
    implemented: true,
    description: 'Checks for the Strict-Transport-Security header.'
  },
  {
    id: 'clickjacking',
    label: 'Clickjacking / X-Frame-Options',
    category: 'category1',
    implemented: true,
    description: 'Checks for X-Frame-Options to prevent framing.'
  },
  {
    id: 'referrer-policy',
    label: 'Referrer-Policy',
    category: 'category1',
    implemented: true,
    description: 'Checks for the Referrer-Policy header.'
  },
  {
    id: 'cache-control',
    label: 'Missing cache-control',
    category: 'category1',
    implemented: true,
    description: 'Flags responses that do not disable caching on sensitive pages.'
  },
  {
    id: 'server-disclosure',
    label: 'Sensitive information in responses (headers)',
    category: 'category1',
    implemented: true,
    description: 'Flags Server / X-Powered-By headers that disclose stack details.'
  },
  {
    id: 'forms-get',
    label: 'Forms using GET',
    category: 'category1',
    implemented: true,
    description: 'Flags forms that submit sensitive data via GET.'
  },
  {
    id: 'password-http',
    label: 'Password fields over HTTP',
    category: 'category1',
    implemented: true,
    description: 'Flags password inputs served without HTTPS.'
  },
  {
    id: 'autocomplete-sensitive',
    label: 'Missing autocomplete="off" on sensitive fields',
    category: 'category1',
    implemented: true,
    description: 'Flags password fields that allow browser autocomplete.'
  },
  {
    id: 'csrf-token',
    label: 'Missing CSRF token',
    category: 'category1',
    implemented: true,
    description: 'Flags state-changing POST forms without an anti-CSRF hidden field.'
  },
  {
    id: 'console-errors',
    label: 'Console errors',
    category: 'category1',
    implemented: true,
    description: 'Reports errors logged to the browser console.'
  },
  {
    id: 'js-exceptions',
    label: 'JavaScript exceptions',
    category: 'category1',
    implemented: true,
    description: 'Reports uncaught JavaScript exceptions.'
  },
  {
    id: 'broken-links',
    label: 'Broken links',
    category: 'category1',
    implemented: true,
    description: 'Reports resources/links that fail to load.'
  },
  {
    id: 'api-status',
    label: 'API status codes',
    category: 'category1',
    implemented: true,
    description: 'Reports 4xx/5xx HTTP responses observed during the scan.'
  },
  {
    id: 'mixed-content',
    label: 'Mixed content',
    category: 'category1',
    implemented: true,
    description: 'Flags HTTP sub-resources loaded on HTTPS pages.'
  },
  {
    id: 'storage-secrets',
    label: 'Sensitive data in localStorage/sessionStorage',
    category: 'category1',
    implemented: true,
    description: 'Flags tokens/credentials stored in web storage.'
  },
  // Not yet implemented — shown but not runnable.
  {
    id: 'https-enforcement',
    label: 'HTTPS enforcement (redirect)',
    category: 'category1',
    implemented: false,
    description: 'Verify HTTP redirects to HTTPS.'
  },
  {
    id: 'password-complexity',
    label: 'Missing password complexity hints',
    category: 'category1',
    implemented: false,
    description: 'Detect weak or missing password policy hints.'
  },
  {
    id: 'missing-logout',
    label: 'Missing logout',
    category: 'category1',
    implemented: false,
    description: 'Verify a logout mechanism exists.'
  },
  {
    id: 'session-after-logout',
    label: 'Session cookie after logout',
    category: 'category1',
    implemented: false,
    description: 'Verify session is invalidated on logout.'
  },
  {
    id: 'session-timeout',
    label: 'Session timeout',
    category: 'category1',
    implemented: false,
    description: 'Verify idle sessions expire.'
  },
  {
    id: 'unauthorized-access',
    label: 'Unauthorized page access',
    category: 'category1',
    implemented: false,
    description: 'Verify protected pages reject unauthenticated access.'
  },
  {
    id: 'directory-browsing',
    label: 'Directory browsing',
    category: 'category1',
    implemented: false,
    description: 'Detect exposed directory listings.'
  },
  {
    id: 'file-upload',
    label: 'File upload validation',
    category: 'category1',
    implemented: false,
    description: 'Verify upload endpoints validate file type/size.'
  },

  // ---------------- Category 2 — AI-assisted ----------------
  {
    id: 'ai-client-secrets',
    label: 'Does the page expose secrets?',
    category: 'category2',
    implemented: true,
    description: 'AI review for API keys, tokens, and credentials in client code.'
  },
  {
    id: 'ai-stack-traces',
    label: 'Does an error message disclose stack traces?',
    category: 'category2',
    implemented: true,
    description: 'AI review for server stack traces surfaced to users.'
  },
  {
    id: 'ai-business-logic',
    label: 'Sensitive business logic in client-side code?',
    category: 'category2',
    implemented: true,
    description: 'AI review for pricing/authorization logic embedded client-side.'
  },
  {
    id: 'ai-implementation-details',
    label: 'Does the UI reveal implementation details?',
    category: 'category2',
    implemented: true,
    description: 'AI review for internal paths, versions, or debug details.'
  },
  {
    id: 'ai-excessive-pii',
    label: 'Is PII visible unnecessarily / forms over-collecting?',
    category: 'category2',
    implemented: true,
    description: 'AI review for unnecessary PII exposure or excessive form fields.'
  }
];

/** IDs that are implemented and enabled by default on a fresh install. */
export const DEFAULT_ENABLED_CHECK_IDS: string[] = CHECK_CATALOG.filter(
  check => check.implemented
).map(check => check.id);

export function isImplemented(id: string): boolean {
  return CHECK_CATALOG.some(check => check.id === id && check.implemented);
}
