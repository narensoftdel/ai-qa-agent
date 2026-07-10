import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { routeAnimations } from '../../../shared/animations/route-animations';
import { ScannerService, ScanProgress } from '../../../core/services/scanner.service';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-scan-history',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  template: `
    <div @routeAnimation class="page-card">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Scan History</mat-card-title>
          <mat-card-subtitle>Review recent assessments and compare results</mat-card-subtitle>
          <span class="spacer"></span>
          <button mat-stroked-button color="primary" type="button" (click)="load()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </mat-card-header>

        <mat-card-content>
          @if (loading()) {
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          }

          @if (error()) {
            <p class="state state--error">
              Unable to load scans. Is the backend running on http://localhost:3000?
            </p>
          } @else if (!loading() && scans().length === 0) {
            <p class="state">No scans yet. Start your first scan from the New Scan page.</p>
          }

          @if (scans().length > 0) {
            <div class="table-wrapper">
              <table mat-table [dataSource]="scans()" class="history-table">
                <ng-container matColumnDef="url">
                  <th mat-header-cell *matHeaderCellDef>Target</th>
                  <td mat-cell *matCellDef="let scan">{{ scan.url }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let scan">
                    <span class="status-pill status-pill--{{ scan.status.toLowerCase() }}">{{
                      scan.status
                    }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="progress">
                  <th mat-header-cell *matHeaderCellDef>Progress</th>
                  <td mat-cell *matCellDef="let scan">
                    <div class="progress-cell">
                      <mat-progress-bar
                        mode="determinate"
                        [value]="scan.progress"
                      ></mat-progress-bar>
                      <span>{{ scan.progress }}%</span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="findings">
                  <th mat-header-cell *matHeaderCellDef>Findings</th>
                  <td mat-cell *matCellDef="let scan">{{ scan.findings ?? 0 }}</td>
                </ng-container>

                <ng-container matColumnDef="startedAt">
                  <th mat-header-cell *matHeaderCellDef>Started</th>
                  <td mat-cell *matCellDef="let scan">{{ formatDate(scan.startedAt) }}</td>
                </ng-container>

                <ng-container matColumnDef="completedAt">
                  <th mat-header-cell *matHeaderCellDef>Completed</th>
                  <td mat-cell *matCellDef="let scan">{{ formatDate(scan.completedAt) }}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let scan">
                    <button
                      mat-icon-button
                      color="primary"
                      matTooltip="View result"
                      (click)="viewResult(scan)"
                    >
                      <mat-icon>visibility</mat-icon>
                    </button>
                    @if (scan.status === 'COMPLETED') {
                      <button
                        mat-icon-button
                        matTooltip="Open HTML report"
                        (click)="openReport(scan)"
                      >
                        <mat-icon>description</mat-icon>
                      </button>
                    }
                    @if (scan.status === 'RUNNING' || scan.status === 'PENDING') {
                      <button
                        mat-icon-button
                        color="warn"
                        matTooltip="Cancel scan"
                        (click)="cancel(scan)"
                      >
                        <mat-icon>stop_circle</mat-icon>
                      </button>
                    }
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
              </table>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    '.page-card { display: grid; gap: 1rem; }',
    'mat-card { border-radius: 1.2rem; padding: 0.4rem 0; }',
    'mat-card-header { align-items: center; }',
    '.spacer { flex: 1; }',
    '.state { padding: 1rem 0.2rem; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); }',
    '.state--error { color: #dc2626; }',
    '.table-wrapper { overflow-x: auto; }',
    '.history-table { width: 100%; background: transparent; }',
    '.progress-cell { display: flex; align-items: center; gap: 0.6rem; min-width: 140px; }',
    '.progress-cell mat-progress-bar { flex: 1; }',
    '.status-pill { display: inline-flex; padding: 0.3rem 0.65rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }',
    '.status-pill--completed { background: color-mix(in srgb, #16a34a 15%, transparent); color: #15803d; }',
    '.status-pill--running { background: color-mix(in srgb, #3b82f6 15%, transparent); color: #2563eb; }',
    '.status-pill--pending { background: color-mix(in srgb, #f59e0b 18%, transparent); color: #b45309; }',
    '.status-pill--failed { background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; }',
    '.status-pill--cancelled { background: color-mix(in srgb, #64748b 15%, transparent); color: #475569; }'
  ],
  animations: [routeAnimations]
})
export class ScanHistoryComponent implements OnInit {
  private readonly scannerService = inject(ScannerService);

  private readonly reportService = inject(ReportService);

  private readonly router = inject(Router);

  protected readonly displayedColumns = [
    'url',
    'status',
    'progress',
    'findings',
    'startedAt',
    'completedAt',
    'actions'
  ];

  protected readonly scans = signal<ScanProgress[]>([]);

  protected readonly loading = signal(false);

  protected readonly error = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.error.set(false);

    this.scannerService.getScans().subscribe({
      next: scans => {
        this.scans.set(
          [...scans].sort(
            (a, b) => new Date(b.startedAt ?? 0).getTime() - new Date(a.startedAt ?? 0).getTime()
          )
        );

        this.loading.set(false);
      },

      error: err => {
        console.error(err);

        this.loading.set(false);

        this.error.set(true);
      }
    });
  }

  viewResult(scan: ScanProgress): void {
    this.router.navigate(['/scan', 'result', scan.id]);
  }

  openReport(scan: ScanProgress): void {
    this.reportService.openHtmlReport(scan.id);
  }

  cancel(scan: ScanProgress): void {
    this.scannerService.cancelScan(scan.id).subscribe({
      next: () => this.load(),

      error: err => console.error(err)
    });
  }

  protected formatDate(value?: string): string {
    if (!value) {
      return '—';
    }

    return new Date(value).toLocaleString();
  }
}
