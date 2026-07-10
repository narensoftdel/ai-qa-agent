import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface SecurityFinding {
  id: string;

  category: string;

  title: string;

  severity: Severity;

  page: string;

  description: string;

  recommendation: string;

  evidence?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FindingService {
  private readonly http = inject(HttpClient);

  private readonly api = 'http://localhost:3000/api';

  readonly findings = signal<SecurityFinding[]>([]);

  readonly loading = signal(false);

  /**
   * GET /api/scans/:id/findings
   */
  getFindings(scanId: string): Observable<SecurityFinding[]> {
    this.loading.set(true);

    return this.http.get<SecurityFinding[]>(`${this.api}/scans/${scanId}/findings`).pipe(
      tap(findings => {
        this.loading.set(false);

        this.findings.set(findings);
      })
    );
  }

  /**
   * Returns findings by severity.
   */
  getBySeverity(severity: Severity): SecurityFinding[] {
    return this.findings().filter(finding => finding.severity === severity);
  }

  /**
   * Returns findings by category.
   */
  getByCategory(category: string): SecurityFinding[] {
    return this.findings().filter(finding => finding.category === category);
  }

  /**
   * Returns total findings count.
   */
  total(): number {
    return this.findings().length;
  }

  /**
   * Returns Critical findings count.
   */
  criticalCount(): number {
    return this.getBySeverity('CRITICAL').length;
  }

  /**
   * Returns High findings count.
   */
  highCount(): number {
    return this.getBySeverity('HIGH').length;
  }

  /**
   * Returns Medium findings count.
   */
  mediumCount(): number {
    return this.getBySeverity('MEDIUM').length;
  }

  /**
   * Returns Low findings count.
   */
  lowCount(): number {
    return this.getBySeverity('LOW').length;
  }

  /**
   * Clears cached findings.
   */
  clear(): void {
    this.findings.set([]);
  }
}
