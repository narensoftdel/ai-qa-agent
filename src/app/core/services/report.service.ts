import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface ScanReport {
  scanId: string;

  generatedAt: string;

  riskScore: number;

  totalPages: number;

  totalFindings: number;

  critical: number;

  high: number;

  medium: number;

  low: number;

  reportUrl?: string;

  categories?: any;

  applicationName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);

  private readonly api = 'http://localhost:3000/api';

  readonly report = signal<ScanReport | null>(null);

  readonly loading = signal(false);

  /**
   * Get Report Summary
   *
   * GET /api/scans/:id/report
   */
  getReport(scanId: string): Observable<ScanReport> {
    this.loading.set(true);

    return this.http.get<ScanReport>(`${this.api}/scans/${scanId}/report`).pipe(
      tap(report => {
        this.loading.set(false);

        this.report.set(report);
      })
    );
  }

  /**
   * Download HTML Report
   *
   * GET /api/scans/:id/report/html
   */
  downloadHtmlReport(scanId: string): Observable<Blob> {
    return this.http.get(
      `${this.api}/scans/${scanId}/report/html`,

      {
        responseType: 'blob'
      }
    );
  }

  /**
   * Open HTML Report
   */
  openHtmlReport(scanId: string): void {
    window.open(
      `${this.api}/scans/${scanId}/report/html`,

      '_blank'
    );
  }

  /**
   * Clear Cached Report
   */
  clear(): void {
    this.report.set(null);
  }
}
