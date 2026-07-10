import { Scan, ScanBrowser, ScanStatus, ScanStep } from '../models/scan.model';

export const SCAN_STEP_DEFINITIONS: Array<{ label: string; detail: string }> = [
  { label: 'Launching Browser', detail: 'Opening a controlled session' },
  { label: 'Logging In', detail: 'Authenticating against the target' },
  { label: 'Discovering Pages', detail: 'Mapping navigation and routes' },
  { label: 'Capturing APIs', detail: 'Inspecting endpoint behavior' },
  { label: 'Capturing Screenshots', detail: 'Rendering key views' },
  { label: 'Analyzing Headers', detail: 'Reviewing transport security' },
  { label: 'Analyzing Cookies', detail: 'Inspecting session handling' },
  { label: 'Analyzing Forms', detail: 'Testing input handling paths' },
  { label: 'Running AI Analysis', detail: 'Prioritizing findings with AI' },
  { label: 'Generating Report', detail: 'Preparing executive output' }
];

/** activeIndex of -1 marks every step pending (used for queued scans). */
export function buildTimeline(activeIndex: number): ScanStep[] {
  return SCAN_STEP_DEFINITIONS.map((step, index) => ({
    ...step,
    status: index < activeIndex ? 'complete' : index === activeIndex ? 'active' : 'pending'
  }));
}

interface ScanSeed {
  id: string;
  name: string;
  target: string;
  status: ScanStatus;
  browser: ScanBrowser;
  startedAt: string;
  completedAt?: string;
  riskScore?: number;
  pagesDiscovered: number;
  apisDiscovered: number;
  activeStepIndex: number;
  consoleLog: string[];
}

const SCAN_SEEDS: ScanSeed[] = [
  {
    id: 's1',
    name: 'Finance RDP Sweep',
    target: 'https://corp-fin-01.internal',
    status: 'Completed',
    browser: 'Chrome',
    startedAt: '2026-07-07 08:12',
    completedAt: '2026-07-07 08:20',
    riskScore: 84,
    pagesDiscovered: 42,
    apisDiscovered: 14,
    activeStepIndex: SCAN_STEP_DEFINITIONS.length,
    consoleLog: [
      '[INFO] Initializing secure browser session',
      '[SUCCESS] Report generation completed'
    ]
  },
  {
    id: 's2',
    name: 'Identity Exposure Review',
    target: 'https://aad-prod.internal',
    status: 'Running',
    browser: 'Edge',
    startedAt: '2026-07-07 09:40',
    pagesDiscovered: 24,
    apisDiscovered: 8,
    activeStepIndex: 3,
    consoleLog: ['[INFO] Discovered 8 API endpoints', '[INFO] Capturing API request/response pairs']
  },
  {
    id: 's3',
    name: 'Cloud Config Baseline',
    target: 'https://aws-prod-2.internal',
    status: 'Completed',
    browser: 'Chrome',
    startedAt: '2026-07-07 09:20',
    completedAt: '2026-07-07 09:28',
    riskScore: 71,
    pagesDiscovered: 31,
    apisDiscovered: 11,
    activeStepIndex: SCAN_STEP_DEFINITIONS.length,
    consoleLog: ['[INFO] Enumerating IAM policies', '[SUCCESS] Report generation completed']
  },
  {
    id: 's4',
    name: 'Customer Portal Penetration Test',
    target: 'https://portal.globex-retail.com',
    status: 'Completed',
    browser: 'Chrome',
    startedAt: '2026-07-06 11:05',
    completedAt: '2026-07-06 11:19',
    riskScore: 77,
    pagesDiscovered: 58,
    apisDiscovered: 22,
    activeStepIndex: SCAN_STEP_DEFINITIONS.length,
    consoleLog: [
      '[INFO] Authenticated as test customer account',
      '[SUCCESS] Report generation completed'
    ]
  },
  {
    id: 's5',
    name: 'Partner API Gateway Review',
    target: 'https://api-gateway.partners.internal',
    status: 'Completed',
    browser: 'Firefox',
    startedAt: '2026-07-05 14:30',
    completedAt: '2026-07-05 14:44',
    riskScore: 63,
    pagesDiscovered: 19,
    apisDiscovered: 27,
    activeStepIndex: SCAN_STEP_DEFINITIONS.length,
    consoleLog: ['[INFO] Loaded OpenAPI specification', '[SUCCESS] Report generation completed']
  },
  {
    id: 's6',
    name: 'Employee Self-Service Portal Audit',
    target: 'https://hr-ess.internal',
    status: 'Failed',
    browser: 'Edge',
    startedAt: '2026-07-06 16:02',
    pagesDiscovered: 12,
    apisDiscovered: 6,
    activeStepIndex: 4,
    consoleLog: [
      '[INFO] Logging in with service account credentials',
      '[ERROR] Authentication step timed out after 3 retries'
    ]
  },
  {
    id: 's7',
    name: 'Mobile Banking Backend Assessment',
    target: 'https://mbanking-api.internal',
    status: 'Completed',
    browser: 'Chrome',
    startedAt: '2026-07-04 07:55',
    completedAt: '2026-07-04 08:12',
    riskScore: 89,
    pagesDiscovered: 16,
    apisDiscovered: 24,
    activeStepIndex: SCAN_STEP_DEFINITIONS.length,
    consoleLog: ['[INFO] Simulating mobile client headers', '[SUCCESS] Report generation completed']
  },
  {
    id: 's8',
    name: 'Vendor Onboarding Workflow Scan',
    target: 'https://vendor-onboarding.internal',
    status: 'Queued',
    browser: 'Firefox',
    startedAt: '2026-07-07 12:00',
    pagesDiscovered: 0,
    apisDiscovered: 0,
    activeStepIndex: -1,
    consoleLog: ['[INFO] Scan queued and awaiting an available worker']
  },
  {
    id: 's9',
    name: 'E-Commerce Checkout Flow Review',
    target: 'https://checkout.globex-retail.com',
    status: 'Running',
    browser: 'Chrome',
    startedAt: '2026-07-07 10:47',
    pagesDiscovered: 9,
    apisDiscovered: 15,
    activeStepIndex: 5,
    consoleLog: [
      '[INFO] Capturing screenshots for checkout funnel',
      '[INFO] Analyzing response headers'
    ]
  },
  {
    id: 's10',
    name: 'Internal Wiki Exposure Check',
    target: 'https://wiki.internal',
    status: 'Stopped',
    browser: 'Edge',
    startedAt: '2026-07-03 18:22',
    pagesDiscovered: 21,
    apisDiscovered: 9,
    activeStepIndex: 6,
    consoleLog: ['[INFO] Enumerating wiki namespaces', '[WARN] Scan stopped manually by operator']
  }
];

const FINDINGS_PER_SCAN = 5;

export const MOCK_SCANS: Scan[] = SCAN_SEEDS.map(seed => {
  const isComplete = seed.activeStepIndex >= SCAN_STEP_DEFINITIONS.length;
  const progress =
    seed.status === 'Queued'
      ? 0
      : Math.round((Math.max(seed.activeStepIndex, 0) / SCAN_STEP_DEFINITIONS.length) * 100);
  const currentStep =
    seed.status === 'Queued'
      ? 'Queued for execution'
      : isComplete
        ? 'Generating Report'
        : SCAN_STEP_DEFINITIONS[seed.activeStepIndex].label;

  return {
    id: seed.id,
    name: seed.name,
    target: seed.target,
    status: seed.status,
    progress: seed.status === 'Completed' ? 100 : progress,
    browser: seed.browser,
    startedAt: seed.startedAt,
    completedAt: seed.completedAt,
    riskScore: seed.riskScore,
    pagesDiscovered: seed.pagesDiscovered,
    apisDiscovered: seed.apisDiscovered,
    findingsCount: FINDINGS_PER_SCAN,
    currentStep,
    timeline: buildTimeline(seed.activeStepIndex),
    consoleLog: seed.consoleLog
  };
});

export const SCAN_IDS: string[] = MOCK_SCANS.map(scan => scan.id);
