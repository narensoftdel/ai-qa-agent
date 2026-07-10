import { BrowserSession } from './browser.session.js';

export type BrowserEngine = 'chromium' | 'firefox' | 'webkit';

export interface BrowserLaunchRequest {
  browser?: BrowserEngine;
  headless?: boolean;
  slowMo?: number;
}

export interface BrowserOpenRequest extends BrowserLaunchRequest {
  url: string;
}

export interface BrowserAgentResponse {
  success: boolean;
  message: string;
  session: BrowserSession;
}

export interface BrowserNavigationResult {
  success: boolean;
  url: string;
  title: string;
}

export interface BrowserStatistics {
  sessionId: string;
  currentUrl: string;
  pagesVisited: number;
  screenshotsTaken: number;
}
