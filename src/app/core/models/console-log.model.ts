export type ConsoleLogLevel = 'info' | 'warning' | 'error';

export interface ConsoleLogEntry {
  id: string;
  scanId: string;
  pageId?: string;
  level: ConsoleLogLevel;
  source: string;
  message: string;
  timestamp: string;
}
