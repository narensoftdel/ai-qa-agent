import { Finding, FindingSeverity, FindingStatus } from '../models/finding.model';
import { SCAN_IDS } from './scans.mock';

interface FindingTemplate {
  severity: FindingSeverity;
  category: string;
  title: string;
  page: string;
  evidence: string;
  recommendation: string;
}

/** 25 curated OWASP-style findings; each is emitted twice across the scan fleet to reach 50 records. */
const FINDING_TEMPLATES: FindingTemplate[] = [
  {
    severity: 'Critical',
    category: 'Authentication',
    title: 'Session token exposed in client-side storage',
    page: '/login',
    evidence:
      'A bearer token is persisted in localStorage after sign-in and remains readable by any script on the page.',
    recommendation:
      'Rotate the exposed token and migrate session storage to an HttpOnly, Secure, SameSite cookie.'
  },
  {
    severity: 'Critical',
    category: 'Broken Access Control',
    title: 'Horizontal privilege escalation via predictable object identifiers',
    page: '/api/accounts/{id}',
    evidence:
      'Incrementing the numeric account identifier returns another customer’s account and transaction data.',
    recommendation:
      'Enforce object-level authorization checks server-side and switch to non-sequential identifiers.'
  },
  {
    severity: 'Critical',
    category: 'Injection',
    title: 'SQL injection in search parameter',
    page: '/search',
    evidence:
      'A single quote in the query string triggers a database error, and a UNION-based payload extracts table names.',
    recommendation:
      'Use parameterized queries or an ORM and add input validation with an allow-list of characters.'
  },
  {
    severity: 'Critical',
    category: 'Cryptography',
    title: 'Weak password hashing algorithm in credential store',
    page: '/api/auth/register',
    evidence:
      'Newly created accounts have their passwords hashed with unsalted MD5 before being persisted.',
    recommendation:
      'Migrate to Argon2id or bcrypt with a unique salt per credential and force a password reset.'
  },
  {
    severity: 'High',
    category: 'Input Validation',
    title: 'Reflected cross-site scripting in feedback form',
    page: '/feedback',
    evidence:
      'HTML and script tags submitted in the comment field are reflected without sanitization on the confirmation page.',
    recommendation:
      'Encode user-supplied content on output and enforce a strict Content-Security-Policy.'
  },
  {
    severity: 'High',
    category: 'Request Forgery',
    title: 'Missing CSRF token on funds transfer endpoint',
    page: '/api/payments/transfer',
    evidence:
      'The transfer request succeeds when replayed from a third-party origin without a CSRF token.',
    recommendation:
      'Require a per-session CSRF token and validate the Origin/Referer header on state-changing requests.'
  },
  {
    severity: 'High',
    category: 'Session Management',
    title: 'Session identifier not rotated after privilege change',
    page: '/account/upgrade',
    evidence:
      'The session cookie value is unchanged after a user is promoted to an administrative role.',
    recommendation:
      'Issue a new session identifier on every authentication or authorization boundary change.'
  },
  {
    severity: 'High',
    category: 'API Security',
    title: 'Excessive data exposure in user profile API',
    page: '/api/users/{id}',
    evidence:
      'The response payload includes national ID numbers and salary fields that the client never renders.',
    recommendation:
      'Introduce response-shaping per consumer and strip fields that are not required by the client.'
  },
  {
    severity: 'High',
    category: 'Server-Side Request Forgery',
    title: 'SSRF via unsanitized webhook URL field',
    page: '/settings/integrations',
    evidence:
      'Supplying an internal metadata service URL as a webhook target causes the server to fetch and return it.',
    recommendation:
      'Validate webhook destinations against an allow-list and block requests to private IP ranges.'
  },
  {
    severity: 'High',
    category: 'Insecure Deserialization',
    title: 'Unsafe deserialization of session restore objects',
    page: '/api/session/restore',
    evidence:
      'A crafted serialized object in the restore payload triggers unexpected server-side method execution.',
    recommendation:
      'Avoid native deserialization of untrusted input; adopt a schema-validated format such as JSON.'
  },
  {
    severity: 'High',
    category: 'File Upload',
    title: 'Unrestricted file upload allows executable script',
    page: '/documents/upload',
    evidence:
      'The upload endpoint accepts a .php file disguised with an image content-type header and stores it in a web-accessible path.',
    recommendation:
      'Validate file content (not just extension), store uploads outside the web root, and disable script execution there.'
  },
  {
    severity: 'High',
    category: 'Broken Authentication',
    title: 'Account lockout not enforced after repeated failed logins',
    page: '/login',
    evidence:
      'Over 200 consecutive incorrect password attempts against the same account were accepted without throttling.',
    recommendation:
      'Add progressive delays and temporary lockout after a small number of failed attempts, with alerting.'
  },
  {
    severity: 'Medium',
    category: 'Transport Security',
    title: 'HSTS header missing on root domain',
    page: '/',
    evidence:
      'The server response does not include the Strict-Transport-Security header, allowing protocol downgrade attacks.',
    recommendation:
      'Configure HSTS with a long max-age at the edge layer and submit the domain for preload.'
  },
  {
    severity: 'Medium',
    category: 'Security Misconfiguration',
    title: 'Directory listing enabled on static assets path',
    page: '/assets/',
    evidence:
      'Requesting the assets directory without a filename returns a full listing of build artifacts and source maps.',
    recommendation:
      'Disable directory browsing on the web server and remove source maps from the production bundle.'
  },
  {
    severity: 'Medium',
    category: 'CORS',
    title: 'Overly permissive CORS policy reflects arbitrary Origin',
    page: '/api/data/export',
    evidence:
      'The Access-Control-Allow-Origin header echoes back any supplied Origin value alongside credentialed requests.',
    recommendation:
      'Restrict allowed origins to a known allow-list and avoid combining wildcard origins with credentials.'
  },
  {
    severity: 'Medium',
    category: 'Clickjacking',
    title: 'Missing X-Frame-Options allows UI redress',
    page: '/admin/dashboard',
    evidence:
      'The administrative dashboard can be embedded in an iframe on an attacker-controlled page.',
    recommendation:
      'Set X-Frame-Options: DENY or a frame-ancestors directive in the Content-Security-Policy.'
  },
  {
    severity: 'Medium',
    category: 'Cookie Security',
    title: 'Session cookie missing Secure and HttpOnly flags',
    page: '/account',
    evidence:
      'The session cookie is transmitted over plain HTTP fallback and is readable via document.cookie.',
    recommendation:
      'Set the Secure, HttpOnly, and SameSite=Lax attributes on all session-bearing cookies.'
  },
  {
    severity: 'Medium',
    category: 'Rate Limiting',
    title: 'No rate limiting on password reset endpoint',
    page: '/api/auth/reset-password',
    evidence:
      'Over 1,000 password reset requests per minute for the same account were processed without throttling.',
    recommendation:
      'Apply per-account and per-IP rate limits, and add a CAPTCHA after repeated requests.'
  },
  {
    severity: 'Medium',
    category: 'Open Redirect',
    title: 'Unvalidated redirect parameter enables phishing',
    page: '/logout',
    evidence:
      'The next query parameter accepts an arbitrary external URL and redirects the authenticated user there.',
    recommendation:
      'Validate redirect targets against a same-origin allow-list before issuing the redirect.'
  },
  {
    severity: 'Medium',
    category: 'Logging & Monitoring',
    title: 'Failed authentication attempts are not logged',
    page: '/login',
    evidence:
      'No audit trail entry is created when repeated invalid credentials are submitted for a known account.',
    recommendation:
      'Emit structured audit events for authentication failures and forward them to the SIEM.'
  },
  {
    severity: 'Medium',
    category: 'Cloud Configuration',
    title: 'Publicly readable storage bucket contains backup archives',
    page: '/assets/backups',
    evidence:
      'An object storage bucket allows anonymous list and read access to nightly database backup archives.',
    recommendation:
      'Remove public access, enable bucket policies that require authentication, and rotate any exposed secrets.'
  },
  {
    severity: 'Low',
    category: 'Information Disclosure',
    title: 'Verbose server error response exposes stack trace',
    page: '/api/errors',
    evidence:
      'Unhandled exceptions return a full stack trace including internal file paths and framework version.',
    recommendation:
      'Return generic error messages in production and log detailed traces server-side only.'
  },
  {
    severity: 'Low',
    category: 'Third-Party & Supply Chain',
    title: 'Outdated client-side library with known CVEs',
    page: '/vendor/bundle.js',
    evidence:
      'A bundled JavaScript dependency is three major versions behind and has two published CVEs.',
    recommendation:
      'Upgrade the dependency and add automated vulnerability scanning to the build pipeline.'
  },
  {
    severity: 'Low',
    category: 'Business Logic',
    title: 'Discount code can be reused beyond intended limit',
    page: '/checkout',
    evidence:
      'A single-use promotional code was successfully applied to eleven separate orders from the same account.',
    recommendation:
      'Enforce redemption limits server-side per account and per code, not just in the UI.'
  },
  {
    severity: 'Low',
    category: 'JWT Security',
    title: 'JWT signature algorithm set to "none" is accepted',
    page: '/api/auth/token',
    evidence:
      'A token with its alg header changed to none and the signature removed is still accepted as valid.',
    recommendation:
      'Explicitly allow-list accepted signing algorithms server-side and reject unsigned tokens.'
  }
];

const STATUS_CYCLE: FindingStatus[] = ['Open', 'Investigating', 'Mitigated', 'False Positive'];

function dateOffset(daysAgo: number): string {
  const base = new Date('2026-07-07T00:00:00Z');
  base.setUTCDate(base.getUTCDate() - daysAgo);
  return base.toISOString().slice(0, 10);
}

/** Each template is emitted twice, spread across the ten scans so every scan owns exactly five findings. */
export const MOCK_FINDINGS: Finding[] = FINDING_TEMPLATES.flatMap((template, templateIndex) =>
  [0, 1].map(variant => {
    const findingIndex = variant === 0 ? templateIndex : templateIndex + FINDING_TEMPLATES.length;
    return {
      id: findingIndex + 1,
      scanId: SCAN_IDS[findingIndex % SCAN_IDS.length],
      severity: template.severity,
      category: template.category,
      title: template.title,
      page: template.page,
      evidence: template.evidence,
      recommendation: template.recommendation,
      status: STATUS_CYCLE[findingIndex % STATUS_CYCLE.length],
      createdDate: dateOffset(findingIndex % 34)
    };
  })
);
