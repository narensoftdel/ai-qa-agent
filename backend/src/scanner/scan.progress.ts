export enum ScanStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface ScanProgress {
  scanId: string;

  status: ScanStatus;

  percentage: number;

  currentStep: string;

  totalSteps: number;

  completedSteps: number;

  message: string;

  startedAt: Date;

  completedAt?: Date;

  error?: string;
}

export const ScanSteps = [
  'Launching Browser',

  'Logging In',

  'Discovering Pages',

  'Capturing Network Traffic',

  'Capturing Console Logs',

  'Capturing Screenshots',

  'Running Security Checks',

  'Running AI Analysis',

  'Generating Report'
];
