export type StatCardTone = 'primary' | 'success' | 'warning' | 'danger';
export type SeverityTone = 'critical' | 'high' | 'medium' | 'low';

export interface DashboardStatCard {
  label: string;
  value: string;
  delta: string;
  icon: string;
  tone: StatCardTone;
}

export interface RiskTrendPoint {
  label: string;
  x: number;
  y: number;
}

export interface SeverityBreakdownItem {
  label: string;
  value: number;
  tone: SeverityTone;
}

export interface DashboardSeverity {
  critical: number;

  high: number;

  medium: number;

  low: number;

  info: number;
}

export interface DashboardRecentScan {
  id: string;

  url: string;

  status: string;

  progress: number;

  currentStep: string;

  findings: number;

  riskScore: number | null;

  createdAt: string;

  startedAt?: string;

  completedAt?: string;
}

export interface DashboardRecentFinding {
  id: string;

  title: string;

  severity: string;

  category: string;

  page: string;
}

export interface DashboardModel {
  totalScans: number;

  pendingScans: number;

  runningScans: number;

  completedScans: number;

  failedScans: number;

  cancelledScans: number;

  totalPages: number;

  totalFindings: number;

  severity: DashboardSeverity;

  averageRiskScore: number;

  recentScans: DashboardRecentScan[];

  recentFindings: DashboardRecentFinding[];
}
