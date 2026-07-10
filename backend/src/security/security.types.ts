export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface SecurityFinding {
  id: string;

  category: string;

  title: string;

  severity: Severity;

  page: string;

  description: string;

  recommendation: string;

  evidence?: string;
}
