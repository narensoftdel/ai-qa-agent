import { FindingSeverity } from './finding.model';

export type SecurityHeaderStatus = 'Present' | 'Missing' | 'Misconfigured';

export interface SecurityHeader {
  id: string;
  pageId: string;
  scanId: string;
  name: string;
  status: SecurityHeaderStatus;
  value?: string;
  severity: FindingSeverity;
  recommendation: string;
}
