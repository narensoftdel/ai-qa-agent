import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile, tap } from 'rxjs';

export interface ScanRequest {
  url: string;

  username?: string;

  password?: string;

  maxDepth?: number;

  maxPages?: number;
}

export interface ScanProgress {
  id: string;

  status: string;

  progress: number;

  currentStep: string;

  findings?: number;

  reportPath?: string;

  startedAt?: string;

  completedAt?: string;

  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private readonly http = inject(HttpClient);

  /**
   * Change this later to environment.apiUrl
   */
  private readonly api = 'http://localhost:3000/api';

  readonly currentScan = signal<ScanProgress | null>(null);

  readonly loading = signal(false);

  readonly scanning = signal(false);

  /**
   * Start New Scan
   */
  startScan(request: ScanRequest): Observable<ScanProgress> {
    this.loading.set(true);

    return this.http
      .post<ScanProgress>(
        `${this.api}/scans`,

        request
      )
      .pipe(
        tap(scan => {
          this.loading.set(false);

          this.scanning.set(true);

          this.currentScan.set(scan);
        })
      );
  }

  /**
   * Get Scan Status
   */
  getScan(scanId: string): Observable<ScanProgress> {
    return this.http.get<ScanProgress>(`${this.api}/scans/${scanId}`);
  }

  /**
   * Poll Scan Every Second
   */
  pollScan(scanId: string): Observable<ScanProgress> {
    return interval(1000).pipe(
      switchMap(() => this.getScan(scanId)),

      tap(scan => {
        this.currentScan.set(scan);

        if (
          scan.status === 'COMPLETED' ||
          scan.status === 'FAILED' ||
          scan.status === 'CANCELLED'
        ) {
          this.scanning.set(false);
        }
      }),

      takeWhile(
        scan =>
          scan.status !== 'COMPLETED' && scan.status !== 'FAILED' && scan.status !== 'CANCELLED',

        true
      )
    );
  }

  /**
   * Scan History
   */
  getScans(): Observable<ScanProgress[]> {
    return this.http.get<ScanProgress[]>(`${this.api}/scans`);
  }

  /**
   * Cancel Scan
   */
  cancelScan(scanId: string): Observable<void> {
    this.scanning.set(false);

    return this.http.delete<void>(`${this.api}/scans/${scanId}`);
  }

  /**
   * Download HTML Report
   */
  downloadReport(scanId: string): Observable<Blob> {
    return this.http.get(
      `${this.api}/scans/${scanId}/report/html`,

      {
        responseType: 'blob'
      }
    );
  }

  /**
   * Download Screenshots
   */
  getScreenshots(scanId: string): Observable<any> {
    return this.http.get(`${this.api}/scans/${scanId}/screenshots`);
  }

  /**
   * Console Logs
   */
  getConsoleLogs(scanId: string): Observable<any> {
    return this.http.get(`${this.api}/scans/${scanId}/console`);
  }

  /**
   * Network Logs
   */
  getNetworkLogs(scanId: string): Observable<any> {
    return this.http.get(`${this.api}/scans/${scanId}/network`);
  }

  /**
   * Discovered Pages
   */
  getPages(scanId: string): Observable<any> {
    return this.http.get(`${this.api}/scans/${scanId}/pages`);
  }

  /**
   * Security Findings
   */
  getFindings(scanId: string): Observable<any> {
    return this.http.get(`${this.api}/scans/${scanId}/findings`);
  }
}
