export type ScanStatus = 'Queued' | 'Running' | 'Completed' | 'Failed' | 'Stopped';
export type ScanBrowser = 'Chrome' | 'Firefox' | 'Edge';
export type ScanAuthenticationType = 'Basic' | 'Bearer Token' | 'API Key';
export type ScanStepStatus = 'pending' | 'active' | 'complete';

export interface ScanConfig {
  applicationName: string;
  applicationUrl: string;
  username: string;
  password: string;
  browser: ScanBrowser;
  authenticationType: ScanAuthenticationType;
  headless: boolean;
  maxDepth: number;
  maxPages: number;
}

export interface ScanStep {
  label: string;
  detail: string;
  status: ScanStepStatus;
}

export interface Scan {
  id: string;
  name: string;
  target: string;
  status: ScanStatus;
  progress: number;
  browser: ScanBrowser;
  startedAt: string;
  completedAt?: string;
  applicationUrl?: string | undefined;
  riskScore?: number;
  pagesDiscovered: number;
  apisDiscovered: number;
  findingsCount: number;
  currentStep: string;
  timeline: ScanStep[];
  consoleLog: string[];
}
