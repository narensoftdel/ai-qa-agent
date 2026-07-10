import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { routeAnimations } from '../../shared/animations/route-animations';
import { ScannerService } from '../../core/services/scanner.service';
import { FindingService, SecurityFinding, Severity } from '../../core/services/finding.service';

interface FindingRow {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  title: string;
  page: string;
  evidence: string;
  recommendation: string;
  status: 'Open' | 'Investigating' | 'Mitigated' | 'False Positive';
  createdDate: string;
}

@Component({
  selector: 'app-findings',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule
  ],
  template: `
    <div @routeAnimation class="page-shell">
      <mat-card class="findings-card">
        <div class="findings-card__header">
          <div>
            <p class="findings-card__eyebrow">Security operations</p>
            <h2>Findings Workspace</h2>
            <p class="findings-card__subtitle">
              Prioritized issues from the latest scan with actionable remediation guidance.
            </p>
          </div>
          <button mat-flat-button color="primary" type="button" (click)="exportCsv()">
            <mat-icon>download</mat-icon>
            Export CSV
          </button>
        </div>

        <div class="toolbar">
          <mat-form-field appearance="outline" class="toolbar__search">
            <mat-label>Search findings</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Search title or evidence" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="toolbar__filter">
            <mat-label>Severity</mat-label>
            <mat-select [(ngModel)]="selectedSeverity">
              <mat-option value="All">All</mat-option>
              <mat-option value="Critical">Critical</mat-option>
              <mat-option value="High">High</mat-option>
              <mat-option value="Medium">Medium</mat-option>
              <mat-option value="Low">Low</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="toolbar__filter">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus">
              <mat-option value="All">All</mat-option>
              <mat-option value="Open">Open</mat-option>
              <mat-option value="Investigating">Investigating</mat-option>
              <mat-option value="Mitigated">Mitigated</mat-option>
              <mat-option value="False Positive">False Positive</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="toolbar__filter">
            <mat-label>Sort by</mat-label>
            <mat-select [(ngModel)]="sortBy">
              <mat-option value="createdDate">Created Date</mat-option>
              <mat-option value="severity">Severity</mat-option>
              <mat-option value="title">Title</mat-option>
              <mat-option value="page">Page</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="table-wrapper">
          <table mat-table [dataSource]="paginatedRows()" class="findings-table">
            <ng-container matColumnDef="severity">
              <th mat-header-cell *matHeaderCellDef>Severity</th>
              <td mat-cell *matCellDef="let row">
                <span class="severity-pill severity-pill--{{ row.severity.toLowerCase() }}">{{
                  row.severity
                }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let row">{{ row.category }}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let row">{{ row.title }}</td>
            </ng-container>

            <ng-container matColumnDef="page">
              <th mat-header-cell *matHeaderCellDef>Page</th>
              <td mat-cell *matCellDef="let row">{{ row.page }}</td>
            </ng-container>

            <ng-container matColumnDef="evidence">
              <th mat-header-cell *matHeaderCellDef>Evidence</th>
              <td mat-cell *matCellDef="let row">{{ row.evidence }}</td>
            </ng-container>

            <ng-container matColumnDef="recommendation">
              <th mat-header-cell *matHeaderCellDef>Recommendation</th>
              <td mat-cell *matCellDef="let row">{{ row.recommendation }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let row">
                <span class="status-pill">{{ row.status }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdDate">
              <th mat-header-cell *matHeaderCellDef>Created Date</th>
              <td mat-cell *matCellDef="let row">{{ row.createdDate }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" class="table-row"></tr>
          </table>
        </div>

        <div class="pagination-bar">
          <span>Showing {{ paginatedRows().length }} of {{ filteredRows().length }} findings</span>
          <mat-paginator
            [length]="filteredRows().length"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 20]"
            (page)="onPageChange($event)"
          ></mat-paginator>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    '.page-shell { display: grid; }',
    '.findings-card { border-radius: 1.35rem; padding: 0.2rem 0 0.4rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.findings-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.1rem 1.2rem 0.5rem; }',
    '.findings-card__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.findings-card__header h2 { margin: 0; font-size: 1.28rem; }',
    '.findings-card__subtitle { margin: 0.2rem 0 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.toolbar { display: grid; grid-template-columns: 1.3fr repeat(3, minmax(0, 1fr)); gap: 0.7rem; padding: 0.6rem 1.2rem 0.8rem; }',
    '.toolbar__search, .toolbar__filter { width: 100%; }',
    '.table-wrapper { padding: 0 1.2rem 0.6rem; overflow: auto; }',
    '.findings-table { width: 100%; background: transparent; }',
    '.table-row { cursor: pointer; }',
    '.severity-pill, .status-pill { display: inline-flex; align-items: center; padding: 0.33rem 0.65rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; }',
    '.severity-pill--critical { background: color-mix(in srgb, #dc2626 16%, transparent); color: #dc2626; }',
    '.severity-pill--high { background: color-mix(in srgb, #f97316 18%, transparent); color: #f97316; }',
    '.severity-pill--medium { background: color-mix(in srgb, #facc15 23%, transparent); color: #a16207; }',
    '.severity-pill--low { background: color-mix(in srgb, #16a34a 16%, transparent); color: #15803d; }',
    '.status-pill { background: color-mix(in srgb, var(--app-accent) 14%, transparent); color: var(--app-accent); }',
    '.pagination-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 1.2rem 1.1rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '@media (max-width: 900px) { .toolbar { grid-template-columns: 1fr 1fr; } }',
    '@media (max-width: 600px) { .findings-card__header { flex-direction: column; align-items: flex-start; } .toolbar { grid-template-columns: 1fr; } .pagination-bar { flex-direction: column; align-items: flex-start; gap: 0.6rem; } }'
  ],
  animations: [routeAnimations]
})
export class FindingsComponent implements OnInit {
  private readonly scannerService = inject(ScannerService);
  private readonly findingService = inject(FindingService);

  protected readonly displayedColumns = [
    'severity',
    'category',
    'title',
    'page',
    'evidence',
    'recommendation',
    'status',
    'createdDate'
  ];
  protected readonly pageSize = signal(8);
  protected readonly pageIndex = signal(0);
  protected readonly searchTerm = signal('');
  protected readonly selectedSeverity = signal('All');
  protected readonly selectedStatus = signal('All');
  protected readonly sortBy = signal('createdDate');

  protected readonly findings = signal<FindingRow[]>([]);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  /**
   * Loads findings of the most recently completed scan.
   */
  private load(): void {
    this.loading.set(true);

    this.scannerService.getScans().subscribe({
      next: scans => {
        const completed = scans
          .filter(scan => scan.status === 'COMPLETED')
          .sort(
            (a, b) =>
              new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime()
          );

        if (completed.length === 0) {
          this.findings.set([]);
          this.loading.set(false);
          return;
        }

        const latest = completed[0];

        this.findingService.getFindings(latest.id).subscribe({
          next: items => {
            this.findings.set(items.map(item => this.toRow(item, latest.completedAt)));
            this.loading.set(false);
          },
          error: err => {
            console.error(err);
            this.loading.set(false);
          }
        });
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private toRow(finding: SecurityFinding, completedAt?: string): FindingRow {
    const severityLabel: Record<Severity, FindingRow['severity']> = {
      CRITICAL: 'Critical',
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low',
      INFO: 'Low'
    };

    return {
      id: finding.id,
      severity: severityLabel[finding.severity] ?? 'Low',
      category: finding.category,
      title: finding.title,
      page: finding.page,
      evidence: finding.evidence ?? finding.description,
      recommendation: finding.recommendation,
      status: 'Open',
      createdDate: completedAt ? new Date(completedAt).toISOString().slice(0, 10) : ''
    };
  }

  protected readonly filteredRows = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.findings()
      .filter(row => {
        const matchesSeverity =
          this.selectedSeverity() === 'All' || row.severity === this.selectedSeverity();
        const matchesStatus =
          this.selectedStatus() === 'All' || row.status === this.selectedStatus();
        const matchesTerm =
          !term ||
          [row.title, row.category, row.page, row.evidence].join(' ').toLowerCase().includes(term);
        return matchesSeverity && matchesStatus && matchesTerm;
      })
      .sort((a, b) => {
        const direction = this.sortBy();
        if (direction === 'severity') {
          const severityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          return severityRank[a.severity] - severityRank[b.severity];
        }
        if (direction === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (direction === 'page') {
          return a.page.localeCompare(b.page);
        }
        return a.createdDate.localeCompare(b.createdDate);
      });
  });

  protected readonly paginatedRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  exportCsv(): void {
    const header = [
      'Severity',
      'Category',
      'Title',
      'Page',
      'Evidence',
      'Recommendation',
      'Status',
      'Created Date'
    ];

    const escape = (value: string) => `"${(value ?? '').replace(/"/g, '""')}"`;

    const lines = this.filteredRows().map(row =>
      [
        row.severity,
        row.category,
        row.title,
        row.page,
        row.evidence,
        row.recommendation,
        row.status,
        row.createdDate
      ]
        .map(escape)
        .join(',')
    );

    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'findings.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
