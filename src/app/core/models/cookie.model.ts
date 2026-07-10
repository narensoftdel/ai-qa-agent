export type SameSitePolicy = 'Strict' | 'Lax' | 'None';
export type CookieRiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Cookie {
  id: string;
  pageId: string;
  scanId: string;
  name: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: SameSitePolicy;
  expires: string;
  riskLevel: CookieRiskLevel;
}
