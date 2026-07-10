export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type FindingStatus = 'Open' | 'Investigating' | 'Mitigated' | 'False Positive';
export type FindingSortField = 'createdDate' | 'severity' | 'title' | 'page';

export interface Finding {
  id: number;
  scanId?: string;
  severity: FindingSeverity;
  category: string;
  title: string;
  page: string;
  evidence: string;
  recommendation: string;
  status: FindingStatus;
  createdDate: string;
}

export type FindingSeverityCounts = Record<FindingSeverity, number>;
