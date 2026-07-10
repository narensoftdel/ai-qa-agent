export type PageAuthState = 'Public' | 'Authenticated' | 'Admin';
export type PageRiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface Page {
  id: string;
  scanId: string;
  path: string;
  url: string;
  title: string;
  authState: PageAuthState;
  riskLevel: PageRiskLevel;
  formsCount: number;
  buttonsCount: number;
  linksCount: number;
  requestsCount: number;
  loadTimeMs: number;
  discoveredAt: string;
}
