# Graph Report - ..  (2026-07-10)

## Corpus Check
- 122 files · ~27,167 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 662 nodes · 995 edges · 49 communities (35 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6bff16e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]

## God Nodes (most connected - your core abstractions)
1. `BrowserSession` - 45 edges
2. `ScanResultComponent` - 24 edges
3. `SecurityFinding` - 20 edges
4. `ScannerService` - 18 edges
5. `logger` - 15 edges
6. `ScannerController` - 13 edges
7. `AIService` - 12 edges
8. `ScannerService` - 12 edges
9. `FindingService` - 12 edges
10. `ArtifactService` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AIAnalysis` --references--> `SecurityFinding`  [EXTRACTED]
  backend/src/ai/ai.service.ts → backend/src/security/security.types.ts
- `BrowserAgentResponse` --references--> `BrowserSession`  [EXTRACTED]
  backend/src/playwright/browser.types.ts → backend/src/playwright/browser.session.ts
- `FindingTemplate` --references--> `FindingSeverity`  [EXTRACTED]
  src/app/core/mock-data/findings.mock.ts → src/app/core/models/finding.model.ts
- `HeaderDefinition` --references--> `FindingSeverity`  [EXTRACTED]
  src/app/core/mock-data/security-headers.mock.ts → src/app/core/models/finding.model.ts
- `Report` --references--> `FindingSeverity`  [EXTRACTED]
  src/app/core/models/report.model.ts → src/app/core/models/finding.model.ts

## Import Cycles
- None detected.

## Communities (49 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.27
Nodes (7): API_GROUPS, ApiGroup, EndpointRow, MOCK_API_ENDPOINTS, ApiEndpoint, ApiRiskLevel, HttpMethod

### Community 1 - "Community 1"
Cohesion: 0.19
Nodes (8): AiProvider, AppLanguage, AppSettings, DefaultBrowser, ThemePreference, DEFAULT_SETTINGS, SettingsService, simulateApiCall()

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (35): author, dependencies, compression, cors, dotenv, express, helmet, openai (+27 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (33): architect, build, extract-i18n, serve, test, builder, configurations, defaultConfiguration (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (6): AboutComponent, HelpComponent, PageDetailsComponent, ProgressStep, SettingsComponent, routeAnimations

### Community 5 - "Community 5"
Cohesion: 0.21
Nodes (11): MOCK_SCANS, SCAN_SEEDS, SCAN_STEP_DEFINITIONS, ScanSeed, Scan, ScanAuthenticationType, ScanBrowser, ScanConfig (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (27): prefix, projectType, root, schematics, sourceRoot, cli, analytics, newProjectRoot (+19 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (12): ConfirmationDialogComponent, EmptyStateComponent, FindingCardComponent, LoadingSpinnerComponent, ProgressCardComponent, RiskCardComponent, ScanCardComponent, SeverityBadgeComponent (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.24
Nodes (7): FINDING_TEMPLATES, MOCK_FINDINGS, STATUS_CYCLE, Finding, FindingSeverityCounts, FindingSortField, FindingStatus

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (7): arrowParens, bracketSpacing, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (25): dependencies, @angular/animations, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material (+17 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (14): AppComponent, appConfig, routes, NAV_ITEMS, NavItem, NavigationItem, navigationItems, AppTheme (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (8): app, env, DashboardController, router, router, Scan, ScannerService, ScanStatus

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (3): AppNotification, NotificationType, NotificationService

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (17): DashboardModel, DashboardRecentFinding, DashboardRecentScan, DashboardSeverity, DashboardStatCard, RiskTrendPoint, SeverityBreakdownItem, SeverityTone (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): Additional Resources, AiSecurityAgent, Building, Code scaffolding, Development server, Running end-to-end tests, Running unit tests

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (8): BrowserService, LaunchBrowserOptions, BrowserAgentResponse, BrowserEngine, BrowserLaunchRequest, BrowserNavigationResult, BrowserOpenRequest, BrowserStatistics

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (3): HtmlReportService, ReportService, ArtifactService

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (3): BrowserAgent, BrowserManager, BrowserSession

### Community 21 - "Community 21"
Cohesion: 0.16
Nodes (8): ReportService, ScanReport, ReportItem, ConsoleErrorSummary, NetworkRequestSummary, PageSummary, RecommendationSummary, ScreenshotSummary

### Community 22 - "Community 22"
Cohesion: 0.24
Nodes (6): LoginDetector, LoginElements, FormLoginStrategy, LoginConfig, LoginStrategy, LoginType

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (4): SecurityFinding, Severity, FindingRow, FindingsComponent

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (6): AIAnalysis, CookiesCheck, FormsCheck, HeadersCheck, SecurityFinding, Severity

### Community 26 - "Community 26"
Cohesion: 0.27
Nodes (8): FindingTemplate, MOCK_PAGES, HEADER_CATALOG, HeaderDefinition, MOCK_SECURITY_HEADERS, FindingSeverity, SecurityHeader, SecurityHeaderStatus

### Community 27 - "Community 27"
Cohesion: 0.27
Nodes (6): LOG_TEMPLATES, LogTemplate, MOCK_CONSOLE_LOGS, SCAN_IDS, ConsoleLogEntry, ConsoleLogLevel

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (7): COOKIE_CATALOG, CookieDefinition, DOMAIN_BY_SCAN, MOCK_COOKIES, Cookie, CookieRiskLevel, SameSitePolicy

### Community 30 - "Community 30"
Cohesion: 0.27
Nodes (3): ScanProgress, ScanRequest, ScanHistoryComponent

### Community 32 - "Community 32"
Cohesion: 0.25
Nodes (6): MOCK_REPORTS, Report, ReportDownload, ReportFormat, ReportGenerationRequest, ReportStatus

### Community 36 - "Community 36"
Cohesion: 0.47
Nodes (3): MOCK_SCREENSHOTS, Screenshot, ScreenshotViewport

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): Page, PageAuthState, PageRiskLevel

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (3): ScanProgress, ScanStatus, ScanSteps

### Community 47 - "Community 47"
Cohesion: 0.18
Nodes (8): AgentManager, logger, BrowserConsoleLog, LoginAgent, NetworkRequest, ScreenshotService, ScanJob, CrawledPage

### Community 48 - "Community 48"
Cohesion: 0.33
Nodes (3): NavigationLink, NavigationResult, NavigationService

## Knowledge Gaps
- **204 isolated node(s):** `singleQuote`, `printWidth`, `tabWidth`, `semi`, `trailingComma` (+199 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ScanResultComponent` connect `Community 17` to `Community 21`, `Community 23`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `ReportService` connect `Community 21` to `Community 4`, `Community 14`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `BrowserSession` connect `Community 20` to `Community 39`, `Community 40`, `Community 43`, `Community 47`, `Community 48`, `Community 18`, `Community 22`, `Community 25`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `singleQuote`, `printWidth`, `tabWidth` to the rest of the system?**
  _204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._