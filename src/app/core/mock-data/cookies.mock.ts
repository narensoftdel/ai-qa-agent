import { Cookie, CookieRiskLevel, SameSitePolicy } from '../models/cookie.model';
import { MOCK_PAGES } from './pages.mock';

interface CookieDefinition {
  name: string;
  sensitive: boolean;
  defaultSameSite: SameSitePolicy;
  expires: string;
}

const COOKIE_CATALOG: CookieDefinition[] = [
  { name: 'session_id', sensitive: true, defaultSameSite: 'Lax', expires: 'Session' },
  { name: 'XSRF-TOKEN', sensitive: false, defaultSameSite: 'Strict', expires: 'Session' },
  { name: 'auth_token', sensitive: true, defaultSameSite: 'Strict', expires: '2026-08-06' },
  { name: 'refresh_token', sensitive: true, defaultSameSite: 'Strict', expires: '2026-10-05' },
  { name: 'locale', sensitive: false, defaultSameSite: 'Lax', expires: '2027-07-07' },
  { name: 'analytics_id', sensitive: false, defaultSameSite: 'None', expires: '2027-01-03' },
  { name: 'feature_flags', sensitive: false, defaultSameSite: 'Lax', expires: 'Session' },
  { name: 'csrf_token', sensitive: false, defaultSameSite: 'Strict', expires: 'Session' }
];

const DOMAIN_BY_SCAN: Record<string, string> = {
  s1: 'corp-fin-01.internal',
  s2: 'aad-prod.internal',
  s3: 'aws-prod-2.internal',
  s4: 'portal.globex-retail.com',
  s5: 'api-gateway.partners.internal',
  s6: 'hr-ess.internal',
  s7: 'mbanking-api.internal',
  s8: 'vendor-onboarding.internal',
  s9: 'checkout.globex-retail.com',
  s10: 'wiki.internal'
};

function riskFor(
  definition: CookieDefinition,
  secure: boolean,
  httpOnly: boolean
): CookieRiskLevel {
  if (definition.sensitive && (!secure || !httpOnly)) {
    return !secure && !httpOnly ? 'Critical' : 'High';
  }
  if (!secure) {
    return 'Medium';
  }
  return 'Low';
}

/** Every page exposes three cookies drawn from the catalog, rotating so all eight cookie types are represented. */
export const MOCK_COOKIES: Cookie[] = MOCK_PAGES.flatMap((page, pageIndex) => {
  const domain = DOMAIN_BY_SCAN[page.scanId];

  return [0, 1, 2].map(slot => {
    const catalogIndex = (pageIndex * 3 + slot) % COOKIE_CATALOG.length;
    const definition = COOKIE_CATALOG[catalogIndex];
    const combinedIndex = pageIndex * 3 + slot;

    const secure = combinedIndex % 6 !== 0;
    const httpOnly = definition.sensitive ? combinedIndex % 4 !== 0 : false;
    const sameSite = definition.defaultSameSite;

    return {
      id: `ck${combinedIndex + 1}`,
      pageId: page.id,
      scanId: page.scanId,
      name: definition.name,
      domain,
      path: '/',
      secure,
      httpOnly,
      sameSite,
      expires: definition.expires,
      riskLevel: riskFor(definition, secure, httpOnly)
    };
  });
});
