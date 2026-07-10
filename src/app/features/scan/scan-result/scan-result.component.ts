import { Component, computed, DestroyRef, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { interval, Subject, switchMap, takeUntil } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { routeAnimations } from '../../../shared/animations/route-animations';

import { ScannerService, ScanProgress } from '../../../core/services/scanner.service';

import { FindingService, SecurityFinding } from '../../../core/services/finding.service';

import { ReportService, ScanReport } from '../../../core/services/report.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JsonPipe, NgClass } from '@angular/common';

interface PageSummary {
  name: string;

  status: string;

  risk: string;

  requests: number;
}

interface ScreenshotSummary {
  title: string;

  src: string;
}

interface RecommendationSummary {
  title: string;

  detail: string;
}

interface NetworkRequestSummary {
  method: string;

  url: string;

  resourceType: string;
}

interface ConsoleErrorSummary {
  text: string;

  type: string;
}

@Component({
  selector: 'app-scan-result',

  standalone: true,

  imports: [
    MatCardModule,

    MatButtonModule,

    MatChipsModule,

    MatIconModule,

    MatTabsModule,

    MatProgressBarModule,
    NgClass
  ],

  templateUrl: './scan-result.component.html',

  styles: [
    '.page-shell { display: grid; }',
    '.result-card { border-radius: 1.35rem; padding: 0.2rem 0 0.4rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.result-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.1rem 1.2rem 0.5rem; }',
    '.result-card__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.result-card__header h2 { margin: 0; font-size: 1.28rem; }',
    '.result-card__subtitle { margin: 0.2rem 0 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.summary-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.8rem; padding: 0.4rem 1.2rem 1rem; }',
    '.summary-card { padding: 1rem; border-radius: 1rem; background: var(--app-surface-muted); display: grid; gap: 0.25rem; }',
    '.summary-card--risk { background: linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 18%, transparent), color-mix(in srgb, #f97316 16%, transparent)); }',
    '.summary-card__label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); }',
    '.summary-card__value { font-size: 1.35rem; font-weight: 700; }',
    '.summary-card__meta { font-size: 0.84rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.result-tabs { padding: 0 1.2rem 1.2rem; }',
    '.tab-content { padding-top: 1rem; }',
    '.overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }',
    '.panel-card, .finding-card, .recommendation-card, .console-card { padding: 1rem; border-radius: 1rem; background: color-mix(in srgb, var(--app-surface-muted) 86%, transparent); border: 1px solid color-mix(in srgb, var(--app-foreground) 8%, transparent); }',
    '.panel-card__title { font-weight: 700; margin-bottom: 0.5rem; }',
    '.chip-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.8rem; }',
    '.list-stack { display: grid; gap: 0.7rem; }',
    '.list-row { display: flex; justify-content: space-between; align-items: center; gap: 0.8rem; padding: 0.8rem 0.9rem; border-radius: 0.9rem; background: color-mix(in srgb, var(--app-surface-muted) 92%, transparent); }',
    '.list-row--panel { border: 1px solid color-mix(in srgb, var(--app-foreground) 8%, transparent); }',
    '.list-row__title { font-weight: 700; }',
    '.list-row__meta { font-size: 0.84rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.risk-pill { display: inline-flex; align-items: center; padding: 0.33rem 0.65rem; border-radius: 999px; font-weight: 700; font-size: 0.75rem; background: color-mix(in srgb, var(--app-accent) 16%, transparent); }',
    '.risk-pill--critical { background: color-mix(in srgb, #dc2626 16%, transparent); color: #dc2626; }',
    '.risk-pill--high { background: color-mix(in srgb, #f97316 18%, transparent); color: #f97316; }',
    '.risk-pill--medium { background: color-mix(in srgb, #facc15 23%, transparent); color: #a16207; }',
    '.risk-pill--low { background: color-mix(in srgb, #16a34a 16%, transparent); color: #15803d; }',
    '.screenshot-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }',
    '.screenshot-card { border-radius: 1rem; overflow: hidden; background: color-mix(in srgb, var(--app-surface-muted) 88%, transparent); }',
    '.screenshot-card__preview { height: 118px; background: linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 24%, transparent), color-mix(in srgb, #0f172a 16%, transparent)); }',
    '.screenshot-card__title {     overflow: auto; padding: 0.8rem 0.9rem; font-weight: 700; }',
    '.console-card__head { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }',
    '@media (max-width: 1100px) { .summary-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .overview-grid { grid-template-columns: 1fr; } .screenshot-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
    '@media (max-width: 700px) { .result-card__header { flex-direction: column; align-items: flex-start; } .summary-grid { grid-template-columns: 1fr; } .screenshot-grid { grid-template-columns: 1fr; } .list-row { flex-direction: column; align-items: flex-start; } }'
  ],
  animations: [routeAnimations]
})
export class ScanResultComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);

  private readonly scannerService = inject(ScannerService);

  private readonly findingService = inject(FindingService);

  private readonly reportService = inject(ReportService);

  private readonly destroy$ = new Subject<void>();

  scanId = '';

  readonly loading = signal(true);

  readonly progress = signal(0);

  readonly currentStep = signal('');

  readonly status = signal('');

  readonly scan = signal<ScanProgress | null>(null);

  readonly report = signal<ScanReport | null>(null);

  readonly findings = signal<SecurityFinding[]>([]);

  readonly screenshots = signal<any[]>([]);

  readonly networkRequests = signal<NetworkRequestSummary[]>([]);

  readonly consoleErrors = signal<ConsoleErrorSummary[]>([]);

  readonly pagesList = signal<PageSummary[]>([]);

  readonly recommendations = signal<RecommendationSummary[]>([]);

  readonly duration = signal('');

  readonly pages = computed(() => this.pagesList().length);

  readonly apis = computed(() => this.networkRequests().length);

  readonly riskScore = computed(() => {
    const findings = this.findings();

    let score = 100;

    findings.forEach(f => {
      switch (f.severity) {
        case 'CRITICAL':
          score -= 25;
          break;

        case 'HIGH':
          score -= 15;
          break;

        case 'MEDIUM':
          score -= 8;
          break;

        case 'LOW':
          score -= 3;
          break;
      }
    });

    return `${Math.max(score, 0)}/100`;
  });

  readonly overviewText = computed(() => {
    return `${this.findings().length} findings detected across ${this.pages()} pages and ${this.apis()} API requests.`;
  });

  getPage(page: any) {
    console.log(page);
  }

  ngOnInit(): void {
    this.scanId = this.route.snapshot.paramMap.get('scanId') ?? '';

    if (!this.scanId) {
      console.error('Scan Id missing');

      return;
    }

    this.startPolling();
  }

  private startPolling(): void {
    interval(1000)
      .pipe(
        switchMap(() => this.scannerService.getScan(this.scanId)),

        takeUntil(this.destroy$)
      )

      .subscribe({
        next: scan => {
          this.scan.set(scan);

          this.progress.set(scan.progress);

          this.currentStep.set(scan.currentStep);

          this.status.set(scan.status);

          if (scan.status === 'COMPLETED') {
            this.loading.set(false);

            this.loadReport();

            this.loadFindings();

            this.loadScreenshots();

            this.loadNetworkLogs();

            this.loadConsoleLogs();

            this.destroy$.next();
          }

          if (scan.status === 'FAILED') {
            this.loading.set(false);

            this.destroy$.next();
          }
        },

        error: err => {
          console.error(err);

          this.loading.set(false);
        }
      });
  }

  private loadReport(): void {
    this.reportService

      .getReport(this.scanId)

      .subscribe({
        next: report => {
          this.report.set(report);
        }
      });
  }

  private loadFindings(): void {
    this.findingService

      .getFindings(this.scanId)

      .subscribe({
        next: findings => {
          this.findings.set(findings);
          this.generatePageSummary();
        }
      });
  }

  private loadScreenshots(): void {
    this.scannerService

      .getScreenshots(this.scanId)

      .subscribe({
        next: screenshots => {
          this.screenshots.set(screenshots);
        },

        error: err => console.error(err)
      });
  }

  private loadNetworkLogs(): void {
    this.scannerService

      .getNetworkLogs(this.scanId)

      .subscribe({
        next: logs => {
          this.networkRequests.set(logs);
        },

        error: err => console.error(err)
      });
  }

  private loadConsoleLogs(): void {
    this.scannerService

      .getConsoleLogs(this.scanId)

      .subscribe({
        next: logs => {
          this.consoleErrors.set(logs);

          this.generateRecommendations();

          this.generatePageSummary();
        },

        error: err => console.error(err)
      });
  }

  downloadReport(): void {
    this.reportService

      .downloadHtmlReport(this.scanId)

      .subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);

          const anchor = document.createElement('a');

          anchor.href = url;

          anchor.download = `scan-${this.scanId}.html`;

          anchor.click();

          window.URL.revokeObjectURL(url);
        },

        error: err => console.error(err)
      });
  }

  openReport(): void {
    this.reportService.openHtmlReport(this.scanId);
  }

  refresh(): void {
    this.loading.set(true);

    this.startPolling();
  }

  private generateRecommendations(): void {
    const recommendations: RecommendationSummary[] = [];

    for (const finding of this.findings()) {
      recommendations.push({
        title: finding.title,

        detail: finding.recommendation
      });
    }

    this.recommendations.set(recommendations);
  }

  private generatePageSummary(): void {
    const pages: PageSummary[] = [];

    const grouped = new Map<string, SecurityFinding[]>();

    for (const finding of this.findings()) {
      if (!grouped.has(finding.page)) {
        grouped.set(finding.page, []);
      }

      grouped.get(finding.page)?.push(finding);
    }

    grouped.forEach((items, page) => {
      let risk = 'Low';

      if (items.some(f => f.severity === 'CRITICAL')) {
        risk = 'Critical';
      } else if (items.some(f => f.severity === 'HIGH')) {
        risk = 'High';
      } else if (items.some(f => f.severity === 'MEDIUM')) {
        risk = 'Medium';
      }

      pages.push({
        name: page,

        status: 'Scanned',

        risk,

        requests: this.networkRequests().filter(n => n.url.startsWith(page)).length
      });
    });

    this.pagesList.set(pages);
  }

  getCriticalCount(): number {
    return this.findings()

      .filter(f => f.severity === 'CRITICAL').length;
  }

  getHighCount(): number {
    return this.findings()

      .filter(f => f.severity === 'HIGH').length;
  }

  getMediumCount(): number {
    return this.findings()

      .filter(f => f.severity === 'MEDIUM').length;
  }

  getLowCount(): number {
    return this.findings()

      .filter(f => f.severity === 'LOW').length;
  }

  getInfoCount(): number {
    return this.findings()

      .filter(f => f.severity === 'INFO').length;
  }

  trackFinding(index: number, item: SecurityFinding): string {
    return item.id;
  }

  trackPage(index: number, item: PageSummary): string {
    return item.name;
  }

  trackScreenshot(index: number, item: any): string {
    return item.title;
  }

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();

    this.scannerService.currentScan.set(null);

    this.findings.set([]);

    this.report.set(null);

    this.screenshots.set([]);

    this.networkRequests.set([]);

    this.consoleErrors.set([]);

    this.pagesList.set([]);

    this.recommendations.set([]);
  }
}
