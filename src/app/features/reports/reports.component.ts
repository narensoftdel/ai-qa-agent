import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { routeAnimations } from '../../shared/animations/route-animations';
import { ScannerService } from '../../core/services/scanner.service';
import { ReportService, ScanReport } from '../../core/services/report.service';

interface ReportItem {
  id: string;
  title: string;
  generatedAt: string;
  scope: string;
  status: 'Completed' | 'Processing' | 'Queued';
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule
  ],
  template: `
    <div @routeAnimation class="page-shell">
      <mat-card class="reports-card">
        <div class="reports-card__header">
          <div>
            <p class="reports-card__eyebrow">Report center</p>
            <h2>Generated Reports</h2>
            <p class="reports-card__subtitle">
              Manage executive-ready export packages for completed scans.
            </p>
          </div>
          <button mat-flat-button color="primary" type="button" (click)="newScan()">
            <mat-icon>add</mat-icon>
            Create Report
          </button>
        </div>

        <div class="toolbar">
          <mat-form-field appearance="outline" class="toolbar__search">
            <mat-label>Search reports</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Search title or scope" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="cards-grid">
          @for (report of paginatedReports(); track report.id) {
            <mat-card class="report-card">
              <div class="report-card__top">
                <div>
                  <div class="report-card__title">{{ report.title }}</div>
                  <div class="report-card__meta">{{ report.scope }}</div>
                </div>
                <span class="risk-pill risk-pill--{{ report.risk.toLowerCase() }}">{{
                  report.risk
                }}</span>
              </div>

              <div class="report-card__body">
                <div class="report-card__row">
                  <span>Generated</span><strong>{{ report.generatedAt }}</strong>
                </div>
                <div class="report-card__row">
                  <span>Status</span><strong>{{ report.status }}</strong>
                </div>
              </div>

              <div class="report-card__actions">
                <button mat-stroked-button type="button" (click)="preview(report)">
                  <mat-icon>visibility</mat-icon>Preview
                </button>
                <button mat-stroked-button type="button" (click)="downloadHtml(report)">
                  <mat-icon>code</mat-icon>HTML
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  type="button"
                  aria-label="Delete report"
                  (click)="remove(report)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card>
          } @empty {
            <p class="empty-state">
              No reports yet — reports are generated automatically when a scan completes.
            </p>
          }
        </div>

        <div class="pagination-bar">
          <span
            >Showing {{ paginatedReports().length }} of {{ filteredReports().length }} reports</span
          >
          <mat-paginator
            [length]="filteredReports().length"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[4, 8, 12]"
            (page)="onPageChange($event)"
          ></mat-paginator>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    '.page-shell { display: grid; }',
    '.reports-card { border-radius: 1.35rem; padding: 0.2rem 0 0.4rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.reports-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.1rem 1.2rem 0.5rem; }',
    '.reports-card__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.reports-card__header h2 { margin: 0; font-size: 1.28rem; }',
    '.reports-card__subtitle { margin: 0.2rem 0 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.toolbar { padding: 0.5rem 1.2rem 0.8rem; }',
    '.toolbar__search { width: min(360px, 100%); }',
    '.cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; padding: 0 1.2rem 0.8rem; }',
    '.empty-state { grid-column: 1 / -1; margin: 0.4rem 0 0.8rem; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); }',
    '.report-card { border-radius: 1rem; padding: 1rem; background: color-mix(in srgb, var(--app-surface-muted) 90%, transparent); }',
    '.report-card__top { display: flex; justify-content: space-between; gap: 0.6rem; align-items: flex-start; }',
    '.report-card__title { font-weight: 700; margin-bottom: 0.25rem; }',
    '.report-card__meta { font-size: 0.84rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.risk-pill { display: inline-flex; padding: 0.3rem 0.65rem; border-radius: 999px; font-size: 0.74rem; font-weight: 700; }',
    '.risk-pill--critical { background: color-mix(in srgb, #dc2626 16%, transparent); color: #dc2626; }',
    '.risk-pill--high { background: color-mix(in srgb, #f97316 18%, transparent); color: #f97316; }',
    '.risk-pill--medium { background: color-mix(in srgb, #facc15 23%, transparent); color: #a16207; }',
    '.risk-pill--low { background: color-mix(in srgb, #16a34a 16%, transparent); color: #15803d; }',
    '.report-card__body { display: grid; gap: 0.45rem; margin: 0.9rem 0 1rem; }',
    '.report-card__row { display: flex; justify-content: space-between; gap: 0.6rem; font-size: 0.92rem; }',
    '.report-card__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }',
    '.pagination-bar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.4rem 1.2rem 1.1rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '@media (max-width: 900px) { .cards-grid { grid-template-columns: 1fr; } }',
    '@media (max-width: 600px) { .reports-card__header { flex-direction: column; align-items: flex-start; } .pagination-bar { flex-direction: column; align-items: flex-start; } .report-card__actions { flex-direction: column; } }'
  ],
  animations: [routeAnimations]
})
export class ReportsComponent implements OnInit {
  private readonly scannerService = inject(ScannerService);
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);

  protected readonly searchTerm = signal('');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(4);

  protected readonly reports = signal<ReportItem[]>([]);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  /**
   * Builds one report card per completed scan from its report summary.
   */
  private load(): void {
    this.loading.set(true);

    this.scannerService.getScans().subscribe({
      next: scans => {
        const completed = scans.filter(scan => scan.status === 'COMPLETED');

        if (completed.length === 0) {
          this.reports.set([]);
          this.loading.set(false);
          return;
        }

        forkJoin(
          completed.map(scan =>
            this.reportService.getReport(scan.id).pipe(
              map(report => this.toItem(report)),
              catchError(() => of(null))
            )
          )
        ).subscribe(items => {
          this.reports.set(
            items
              .filter((item): item is ReportItem => item !== null)
              .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
          );
          this.loading.set(false);
        });
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private toItem(report: ScanReport): ReportItem {
    let risk: ReportItem['risk'] = 'Low';

    if (report.critical > 0) {
      risk = 'Critical';
    } else if (report.high > 0) {
      risk = 'High';
    } else if (report.medium > 0) {
      risk = 'Medium';
    }

    return {
      id: report.scanId,
      title: `Security report — ${this.hostName(report.applicationName)}`,
      generatedAt: new Date(report.generatedAt).toLocaleString(),
      scope: report.applicationName,
      status: 'Completed',
      risk
    };
  }

  private hostName(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  newScan(): void {
    this.router.navigate(['/scan', 'new']);
  }

  preview(report: ReportItem): void {
    this.reportService.openHtmlReport(report.id);
  }

  downloadHtml(report: ReportItem): void {
    this.reportService.downloadHtmlReport(report.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `scan-${report.id}.html`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => console.error(err)
    });
  }

  remove(report: ReportItem): void {
    this.scannerService.cancelScan(report.id).subscribe({
      next: () => this.load(),
      error: err => console.error(err)
    });
  }

  protected readonly filteredReports = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.reports().filter(
      report => !term || `${report.title} ${report.scope}`.toLowerCase().includes(term)
    );
  });

  protected readonly paginatedReports = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredReports().slice(start, start + this.pageSize());
  });

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
