import { FindingSeverity } from '../models/finding.model';
import { SecurityHeader, SecurityHeaderStatus } from '../models/security-header.model';
import { MOCK_PAGES } from './pages.mock';

interface HeaderDefinition {
  name: string;
  presentValue: string;
  missingSeverity: FindingSeverity;
  missingRecommendation: string;
  misconfiguredValue: string;
  misconfiguredSeverity: FindingSeverity;
  misconfiguredRecommendation: string;
}

const HEADER_CATALOG: HeaderDefinition[] = [
  {
    name: 'Strict-Transport-Security',
    presentValue: 'max-age=63072000; includeSubDomains; preload',
    missingSeverity: 'Medium',
    missingRecommendation:
      'Configure HSTS with a long max-age and submit the domain for browser preload lists.',
    misconfiguredValue: 'max-age=300',
    misconfiguredSeverity: 'Low',
    misconfiguredRecommendation: 'Increase max-age to at least one year and include subdomains.'
  },
  {
    name: 'Content-Security-Policy',
    presentValue: "default-src 'self'; script-src 'self' cdn.internal; object-src 'none'",
    missingSeverity: 'High',
    missingRecommendation:
      'Define a strict Content-Security-Policy to reduce the impact of injected script execution.',
    misconfiguredValue: "default-src *; script-src * 'unsafe-inline'",
    misconfiguredSeverity: 'High',
    misconfiguredRecommendation:
      'Remove wildcard sources and unsafe-inline; scope the policy to trusted origins.'
  },
  {
    name: 'X-Frame-Options',
    presentValue: 'DENY',
    missingSeverity: 'Medium',
    missingRecommendation:
      'Set X-Frame-Options: DENY or a frame-ancestors CSP directive to prevent clickjacking.',
    misconfiguredValue: 'ALLOW-FROM https://untrusted.example',
    misconfiguredSeverity: 'Medium',
    misconfiguredRecommendation:
      'Replace the deprecated ALLOW-FROM directive with a frame-ancestors CSP directive.'
  },
  {
    name: 'X-Content-Type-Options',
    presentValue: 'nosniff',
    missingSeverity: 'Low',
    missingRecommendation: 'Add X-Content-Type-Options: nosniff to prevent MIME-sniffing attacks.',
    misconfiguredValue: 'sniff',
    misconfiguredSeverity: 'Low',
    misconfiguredRecommendation:
      'Set the header value to nosniff; no other value is honored by browsers.'
  },
  {
    name: 'Referrer-Policy',
    presentValue: 'strict-origin-when-cross-origin',
    missingSeverity: 'Low',
    missingRecommendation:
      'Set a Referrer-Policy to avoid leaking full URLs to third-party destinations.',
    misconfiguredValue: 'unsafe-url',
    misconfiguredSeverity: 'Medium',
    misconfiguredRecommendation:
      'Avoid the unsafe-url policy; use strict-origin-when-cross-origin instead.'
  },
  {
    name: 'Permissions-Policy',
    presentValue: 'geolocation=(), camera=(), microphone=()',
    missingSeverity: 'Low',
    missingRecommendation:
      'Define a Permissions-Policy to restrict access to sensitive browser features.',
    misconfiguredValue: 'geolocation=(*)',
    misconfiguredSeverity: 'Medium',
    misconfiguredRecommendation:
      'Scope Permissions-Policy directives to specific trusted origins instead of wildcards.'
  },
  {
    name: 'X-XSS-Protection',
    presentValue: '0',
    missingSeverity: 'Low',
    missingRecommendation:
      'Set X-XSS-Protection: 0 and rely on Content-Security-Policy for injection defense.',
    misconfiguredValue: '1; mode=block',
    misconfiguredSeverity: 'Low',
    misconfiguredRecommendation:
      'This legacy header is deprecated; disable it (0) and enforce protection via CSP instead.'
  },
  {
    name: 'Cross-Origin-Opener-Policy',
    presentValue: 'same-origin',
    missingSeverity: 'Medium',
    missingRecommendation:
      'Set Cross-Origin-Opener-Policy: same-origin to isolate the browsing context from cross-origin windows.',
    misconfiguredValue: 'unsafe-none',
    misconfiguredSeverity: 'Medium',
    misconfiguredRecommendation:
      'Avoid unsafe-none; use same-origin to enable cross-origin isolation protections.'
  }
];

function statusFor(combinedIndex: number): SecurityHeaderStatus {
  if (combinedIndex % 5 === 0) {
    return 'Missing';
  }
  if (combinedIndex % 7 === 0) {
    return 'Misconfigured';
  }
  return 'Present';
}

export const MOCK_SECURITY_HEADERS: SecurityHeader[] = MOCK_PAGES.flatMap((page, pageIndex) =>
  HEADER_CATALOG.map((header, headerIndex) => {
    const combinedIndex = pageIndex * HEADER_CATALOG.length + headerIndex;
    const status = statusFor(combinedIndex);

    const base = {
      id: `hdr${combinedIndex + 1}`,
      pageId: page.id,
      scanId: page.scanId,
      name: header.name
    };

    if (status === 'Missing') {
      return {
        ...base,
        status,
        severity: header.missingSeverity,
        recommendation: header.missingRecommendation
      };
    }
    if (status === 'Misconfigured') {
      return {
        ...base,
        status,
        value: header.misconfiguredValue,
        severity: header.misconfiguredSeverity,
        recommendation: header.misconfiguredRecommendation
      };
    }
    return {
      ...base,
      status,
      value: header.presentValue,
      severity: 'Low' as FindingSeverity,
      recommendation: 'No action required.'
    };
  })
);
