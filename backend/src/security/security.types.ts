export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface SecurityFinding {
  id: string;

  /** Catalog check ID this finding came from (see check-catalog.ts). */
  checkId: string;

  category: string;

  title: string;

  severity: Severity;

  page: string;

  description: string;

  recommendation: string;

  evidence?: string;
}
