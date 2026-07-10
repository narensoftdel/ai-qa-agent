import { ConsoleLogEntry, ConsoleLogLevel } from '../models/console-log.model';
import { MOCK_PAGES } from './pages.mock';
import { SCAN_IDS } from './scans.mock';

interface LogTemplate {
  level: ConsoleLogLevel;
  source: string;
  message: string;
}

const LOG_TEMPLATES: LogTemplate[] = [
  { level: 'info', source: 'app.bundle.js', message: 'Initializing secure browser session' },
  {
    level: 'info',
    source: 'main.chunk.js',
    message: 'DOM content loaded and interactive elements indexed'
  },
  {
    level: 'warning',
    source: 'analytics.js',
    message: 'XHR request to /api/analytics returned 401 Unauthorized'
  },
  {
    level: 'error',
    source: 'app.bundle.js',
    message: "Uncaught TypeError: Cannot read properties of undefined (reading 'value')"
  },
  {
    level: 'warning',
    source: 'vendor.js',
    message: 'Mixed content: page loaded over HTTPS but requested an insecure image resource'
  },
  {
    level: 'error',
    source: 'sentry.js',
    message: 'Failed to load resource: net::ERR_CONNECTION_REFUSED'
  },
  {
    level: 'warning',
    source: 'app.bundle.js',
    message: 'Content-Security-Policy blocked an inline script (script-src directive)'
  },
  {
    level: 'info',
    source: 'service-worker.js',
    message: 'Service worker registered and activated'
  },
  {
    level: 'warning',
    source: 'forms.js',
    message: 'A form field is missing an associated label element'
  },
  {
    level: 'error',
    source: 'checkout.js',
    message: 'Uncaught (in promise) TypeError: Failed to fetch'
  }
];

const LOGS_PER_SCAN = 8;

function addMinutes(startedAt: string, minutes: number): string {
  const parsed = new Date(startedAt.replace(' ', 'T') + ':00');
  parsed.setMinutes(parsed.getMinutes() + minutes);
  return parsed.toISOString().slice(0, 16).replace('T', ' ');
}

/** Eight console lines per scan, cycling through a realistic template catalog and timestamped against the scan start. */
export const MOCK_CONSOLE_LOGS: ConsoleLogEntry[] = SCAN_IDS.flatMap((scanId, scanIndex) => {
  const scanPages = MOCK_PAGES.filter(page => page.scanId === scanId);
  const startedAt = scanPages[0]?.discoveredAt ?? '2026-07-07 00:00';

  return Array.from({ length: LOGS_PER_SCAN }, (_, i) => {
    const combinedIndex = scanIndex * LOGS_PER_SCAN + i;
    const template = LOG_TEMPLATES[combinedIndex % LOG_TEMPLATES.length];
    const page = scanPages[i % Math.max(scanPages.length, 1)];

    return {
      id: `log${combinedIndex + 1}`,
      scanId,
      pageId: page?.id,
      level: template.level,
      source: template.source,
      message: template.message,
      timestamp: addMinutes(startedAt, i)
    };
  });
});
