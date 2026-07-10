export interface Scan {
  id: string;

  applicationUrl: string;

  username: string;

  password: string;

  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

  progress: number;

  currentStep: string;

  startedAt: Date;

  completedAt?: Date;
}
