import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ReportService } from '../../core/services/report.service';
import {
  DashboardModel,
  DashboardStatCard,
  RiskTrendPoint,
  SeverityBreakdownItem
} from '../../core/models/dashboard.model';

interface ScanItem {
  id: string;
  name: string;
  target: string;
  status: string;
  time: string;
}

interface FindingItem {
  id: string;
  title: string;
  severity: string;
  asset: string;
}

interface ReportItem {
  id: string;
  title: string;
  owner: string;
  generated: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <app-page-header
      title="Dashboard"
      subtitle="Executive visibility into scan posture and security operations."
      icon="dashboard"
    ></app-page-header>

    <section class="dashboard-shell">
      @if (loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      @if (error()) {
        <mat-card class="panel panel--error">
          <mat-icon>cloud_off</mat-icon>
          <div>
            <h3>Unable to reach the scanner backend</h3>
            <p>Make sure the API is running on http://localhost:3000, then retry.</p>
          </div>
          <button mat-flat-button color="primary" type="button" (click)="load()">Retry</button>
        </mat-card>
      }

      <section class="kpi-grid">
        @for (stat of statCards(); track stat.label) {
          <mat-card class="stat-card stat-card--{{ stat.tone }}">
            <div class="stat-card__icon">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-card__body">
              <p class="stat-card__label">{{ stat.label }}</p>
              <h3>{{ stat.value }}</h3>
              <span>{{ stat.delta }}</span>
            </div>
          </mat-card>
        }
      </section>

      <section class="dashboard-grid">
        <mat-card class="panel panel--chart">
          <div class="panel__header">
            <div>
              <p class="panel__eyebrow">Risk trend</p>
              <h3>Average risk score</h3>
            </div>
            <span class="panel__pill">{{ averageRiskScore() }} / 100</span>
          </div>

          @if (riskTrend().length > 0) {
            <div class="chart-card">
              <svg viewBox="0 0 320 140" class="chart-card__svg" aria-label="Risk trend chart">
                <path [attr.d]="trendLinePath()" class="chart-card__line"></path>
                <path [attr.d]="trendAreaPath()" class="chart-card__area"></path>
                @for (point of riskTrend(); track point.label) {
                  <circle
                    [attr.cx]="point.x"
                    [attr.cy]="point.y"
                    r="4.5"
                    class="chart-card__dot"
                  ></circle>
                }
              </svg>
              <div class="chart-card__labels">
                @for (point of riskTrend(); track point.label) {
                  <span>{{ point.label }}</span>
                }
              </div>
            </div>
          } @else {
            <p class="panel__empty">Risk scores appear here after a scan completes.</p>
          }
        </mat-card>

        <mat-card class="panel">
          <div class="panel__header">
            <div>
              <p class="panel__eyebrow">Severity mix</p>
              <h3>Findings distribution</h3>
            </div>
          </div>

          @if (totalFindings() > 0) {
            <div class="stacked-bars">
              @for (item of severityBreakdown(); track item.label) {
                <div class="stacked-bars__row">
                  <div class="stacked-bars__meta">
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                  <div class="stacked-bars__track">
                    <div
                      class="stacked-bars__fill stacked-bars__fill--{{ item.tone }}"
                      [style.width.%]="severityPercent(item.value)"
                    ></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="panel__empty">No findings recorded yet.</p>
          }
        </mat-card>
      </section>

      <section class="dashboard-grid dashboard-grid--lower">
        <mat-card class="panel">
          <div class="panel__header">
            <div>
              <p class="panel__eyebrow">Recent scans</p>
              <h3>Latest activity</h3>
            </div>
            <button mat-stroked-button color="primary" type="button" (click)="viewAllScans()">
              View all
            </button>
          </div>

          <div class="list-stack">
            @for (scan of recentScans(); track scan.id) {
              <div class="list-item list-item--link" (click)="openScan(scan.id)">
                <div>
                  <strong>{{ scan.name }}</strong>
                  <p>{{ scan.target }}</p>
                </div>
                <div class="list-item__status">
                  <span>{{ scan.status }}</span>
                  <small>{{ scan.time }}</small>
                </div>
              </div>
            } @empty {
              <p class="panel__empty">No scans yet. Start one from New Scan.</p>
            }
          </div>
        </mat-card>

        <mat-card class="panel">
          <div class="panel__header">
            <div>
              <p class="panel__eyebrow">Recent findings</p>
              <h3>Priority alerts</h3>
            </div>
          </div>

          <div class="list-stack">
            @for (finding of recentFindings(); track finding.id) {
              <div class="list-item">
                <div>
                  <strong>{{ finding.title }}</strong>
                  <p>{{ finding.asset }}</p>
                </div>
                <span class="severity-pill severity-pill--{{ finding.severity.toLowerCase() }}">{{
                  finding.severity
                }}</span>
              </div>
            } @empty {
              <p class="panel__empty">Findings from completed scans appear here.</p>
            }
          </div>
        </mat-card>

        <mat-card class="panel">
          <div class="panel__header">
            <div>
              <p class="panel__eyebrow">Recent reports</p>
              <h3>Shared intelligence</h3>
            </div>
          </div>

          <div class="list-stack">
            @for (report of recentReports(); track report.id) {
              <div class="list-item list-item--link" (click)="openReport(report.id)">
                <div>
                  <strong>{{ report.title }}</strong>
                  <p>{{ report.owner }}</p>
                </div>
                <small>{{ report.generated }}</small>
              </div>
            } @empty {
              <p class="panel__empty">Reports are generated when a scan completes.</p>
            }
          </div>
        </mat-card>
      </section>
    </section>
  `,
  styles: [
    '.dashboard-shell { display: grid; gap: 1.1rem; margin-top:20px; }',
    '.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }',
    '.stat-card { display: flex; align-items: center; gap: 0.95rem; padding: 1rem 1.1rem; border-radius: 1.25rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.stat-card__icon { display: grid; place-items: center; width: 2.85rem; height: 2.85rem; border-radius: 0.95rem; background: color-mix(in srgb, var(--app-accent) 12%, transparent); color: var(--app-accent); }',
    '.stat-card--success .stat-card__icon { background: color-mix(in srgb, #16a34a 14%, transparent); color: #16a34a; }',
    '.stat-card--warning .stat-card__icon { background: color-mix(in srgb, #d97706 14%, transparent); color: #d97706; }',
    '.stat-card--danger .stat-card__icon { background: color-mix(in srgb, #dc2626 14%, transparent); color: #dc2626; }',
    '.stat-card__body h3 { margin: 0.1rem 0 0.2rem; font-size: 1.25rem; }',
    '.stat-card__label { margin: 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; color: color-mix(in srgb, var(--app-foreground) 72%, transparent); }',
    '.stat-card__body span { font-size: 0.8rem; color: color-mix(in srgb, var(--app-foreground) 66%, transparent); }',
    '.dashboard-grid { display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 1rem; }',
    '.dashboard-grid--lower { grid-template-columns: repeat(3, minmax(0, 1fr)); }',
    '.panel { padding: 1rem 1.1rem; border-radius: 1.25rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.panel--error { display: flex; align-items: center; gap: 1rem; color: #dc2626; }',
    '.panel--error h3 { margin: 0 0 0.2rem; }',
    '.panel--error p { margin: 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.panel__empty { margin: 0.4rem 0 0.6rem; color: color-mix(in srgb, var(--app-foreground) 62%, transparent); }',
    '.panel__header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.9rem; }',
    '.panel__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.panel__header h3 { margin: 0; font-size: 1.05rem; }',
    '.panel__pill { padding: 0.3rem 0.6rem; border-radius: 999px; background: var(--app-surface-muted); color: var(--app-accent); font-weight: 700; font-size: 0.8rem; }',
    '.chart-card { display: grid; gap: 0.4rem; }',
    '.chart-card__svg { width: 100%; height: auto; }',
    '.chart-card__line { fill: none; stroke: var(--app-accent); stroke-width: 3; stroke-linecap: round; }',
    '.chart-card__area { fill: color-mix(in srgb, var(--app-accent) 18%, transparent); }',
    '.chart-card__dot { fill: var(--app-accent); }',
    '.chart-card__labels { display: flex; justify-content: space-between; color: color-mix(in srgb, var(--app-foreground) 62%, transparent); font-size: 0.78rem; }',
    '.stacked-bars { display: grid; gap: 0.8rem; }',
    '.stacked-bars__row { display: grid; gap: 0.35rem; }',
    '.stacked-bars__meta { display: flex; justify-content: space-between; font-size: 0.9rem; }',
    '.stacked-bars__track { width: 100%; height: 0.62rem; border-radius: 999px; background: color-mix(in srgb, var(--app-foreground) 8%, transparent); overflow: hidden; }',
    '.stacked-bars__fill { height: 100%; border-radius: inherit; }',
    '.stacked-bars__fill--critical { background: #dc2626; }',
    '.stacked-bars__fill--high { background: #f59e0b; }',
    '.stacked-bars__fill--medium { background: #3b82f6; }',
    '.stacked-bars__fill--low { background: #16a34a; }',
    '.list-stack { display: grid; gap: 0.75rem; }',
    '.list-item { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.7rem 0; border-bottom: 1px solid var(--app-border); }',
    '.list-item--link { cursor: pointer; }',
    '.list-item:last-child { border-bottom: none; padding-bottom: 0; }',
    '.list-item strong { display: block; margin-bottom: 0.2rem; }',
    '.list-item p, .list-item small { margin: 0; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); }',
    '.list-item__status { text-align: right; display: grid; gap: 0.2rem; }',
    '.severity-pill { padding: 0.28rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }',
    '.severity-pill--critical { background: color-mix(in srgb, #dc2626 14%, transparent); color: #dc2626; }',
    '.severity-pill--high { background: color-mix(in srgb, #f59e0b 16%, transparent); color: #d97706; }',
    '.severity-pill--medium { background: color-mix(in srgb, #3b82f6 14%, transparent); color: #2563eb; }',
    '.severity-pill--low { background: color-mix(in srgb, #16a34a 14%, transparent); color: #15803d; }',
    '.severity-pill--info { background: color-mix(in srgb, #64748b 14%, transparent); color: #475569; }',
    '@media (max-width: 980px) { .dashboard-grid { grid-template-columns: 1fr; } .dashboard-grid--lower { grid-template-columns: 1fr; } }',
    '@media (max-width: 640px) { .stat-card { padding: 0.95rem; } .panel__header { align-items: flex-start; flex-direction: column; } .list-item { flex-direction: column; align-items: flex-start; } .list-item__status { text-align: left; } }'
  ]
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  private readonly reportService = inject(ReportService);

  private readonly router = inject(Router);

  protected readonly loading = signal(false);

  protected readonly error = signal(false);

  protected readonly dashboard = signal<DashboardModel | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.error.set(false);

    this.dashboardService.getDashboard().subscribe({
      next: data => {
        this.dashboard.set(data);

        this.loading.set(false);
      },

      error: err => {
        console.error(err);

        this.loading.set(false);

        this.error.set(true);
      }
    });
  }

  protected readonly statCards = computed<DashboardStatCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Total Scans',
        value: `${data?.totalScans ?? 0}`,
        delta: `${data?.pendingScans ?? 0} queued`,
        icon: 'search',
        tone: 'primary'
      },
      {
        label: 'Running Scans',
        value: `${data?.runningScans ?? 0}`,
        delta: `${data?.completedScans ?? 0} completed`,
        icon: 'play_circle',
        tone: 'success'
      },
      {
        label: 'Total Findings',
        value: `${data?.totalFindings ?? 0}`,
        delta: `${data?.totalPages ?? 0} pages analyzed`,
        icon: 'task_alt',
        tone: 'warning'
      },
      {
        label: 'Critical Findings',
        value: `${data?.severity?.critical ?? 0}`,
        delta: `${data?.failedScans ?? 0} failed scans`,
        icon: 'warning',
        tone: 'danger'
      }
    ];
  });

  protected readonly averageRiskScore = computed(
    () => `${this.dashboard()?.averageRiskScore ?? 0}`
  );

  protected readonly totalFindings = computed(() => this.dashboard()?.totalFindings ?? 0);

  protected readonly severityBreakdown = computed<SeverityBreakdownItem[]>(() => {
    const severity = this.dashboard()?.severity;

    return [
      { label: 'Critical', value: severity?.critical ?? 0, tone: 'critical' },
      { label: 'High', value: severity?.high ?? 0, tone: 'high' },
      { label: 'Medium', value: severity?.medium ?? 0, tone: 'medium' },
      { label: 'Low', value: severity?.low ?? 0, tone: 'low' }
    ];
  });

  protected severityPercent(value: number): number {
    const total = this.totalFindings();

    return total === 0 ? 0 : Math.round((value / total) * 100);
  }

  protected readonly riskTrend = computed<RiskTrendPoint[]>(() => {
    const completed = (this.dashboard()?.recentScans ?? [])
      .filter(scan => scan.status === 'COMPLETED' && scan.riskScore !== null)
      .slice()
      .reverse();

    if (completed.length === 0) {
      return [];
    }

    const left = 20;

    const right = 300;

    const step = completed.length === 1 ? 0 : (right - left) / (completed.length - 1);

    return completed.map((scan, index) => ({
      label: this.shortLabel(scan.completedAt ?? scan.createdAt),

      x: completed.length === 1 ? (left + right) / 2 : left + index * step,

      y: 120 - ((scan.riskScore ?? 0) / 100) * 100
    }));
  });

  protected readonly trendLinePath = computed(() => {
    const points = this.riskTrend();

    if (points.length === 0) {
      return '';
    }

    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  });

  protected readonly trendAreaPath = computed(() => {
    const points = this.riskTrend();

    if (points.length === 0) {
      return '';
    }

    const first = points[0];

    const last = points[points.length - 1];

    return `${this.trendLinePath()} L ${last.x} 130 L ${first.x} 130 Z`;
  });

  protected readonly recentScans = computed<ScanItem[]>(() =>
    (this.dashboard()?.recentScans ?? []).map(scan => ({
      id: scan.id,

      name: this.hostName(scan.url),

      target: scan.url,

      status: scan.status,

      time: this.relativeTime(scan.completedAt ?? scan.startedAt ?? scan.createdAt)
    }))
  );

  protected readonly recentFindings = computed<FindingItem[]>(() =>
    (this.dashboard()?.recentFindings ?? []).map(finding => ({
      id: finding.id,

      title: finding.title,

      severity: finding.severity,

      asset: finding.page || finding.category
    }))
  );

  protected readonly recentReports = computed<ReportItem[]>(() =>
    (this.dashboard()?.recentScans ?? [])
      .filter(scan => scan.status === 'COMPLETED')
      .map(scan => ({
        id: scan.id,

        title: `Security report — ${this.hostName(scan.url)}`,

        owner: scan.url,

        generated: this.relativeTime(scan.completedAt ?? scan.createdAt)
      }))
  );

  viewAllScans(): void {
    this.router.navigate(['/scan', 'history']);
  }

  openScan(scanId: string): void {
    this.router.navigate(['/scan', 'result', scanId]);
  }

  openReport(scanId: string): void {
    this.reportService.openHtmlReport(scanId);
  }

  private hostName(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  private relativeTime(value?: string): string {
    if (!value) {
      return '';
    }

    const elapsedMs = Date.now() - new Date(value).getTime();

    const minutes = Math.round(elapsedMs / 60000);

    if (minutes < 1) {
      return 'just now';
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    return `${Math.round(hours / 24)} day(s) ago`;
  }

  private shortLabel(value?: string): string {
    if (!value) {
      return '';
    }

    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',

      day: 'numeric'
    });
  }
}
