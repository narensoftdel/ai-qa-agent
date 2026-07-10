import { FindingSeverity } from './finding.model';

export type ReportStatus = 'Completed' | 'Processing' | 'Queued';
export type ReportFormat = 'PDF' | 'HTML' | 'CSV';

export interface Report {
  id: number;
  scanId?: string;
  title: string;
  scope: string;
  owner: string;
  generatedAt: string;
  status: ReportStatus;
  risk: FindingSeverity;
}

export interface ReportGenerationRequest {
  title: string;
  scope: string;
  scanId?: string;
  formats: ReportFormat[];
}

export interface ReportDownload {
  id: number;
  format: ReportFormat;
  url: string;
}
