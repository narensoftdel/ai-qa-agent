import fs from 'fs';
import path from 'path';

import { SecurityFinding } from '../security/security.types.js';

/**
 * Reads scan artifacts persisted by the agent under storage/<scanId>/.
 */
export class ArtifactService {
  private readonly baseDirectory = path.join(process.cwd(), 'storage');

  scanDirectory(scanId: string): string {
    return path.join(this.baseDirectory, scanId);
  }

  /**
   * Read a stored JSON artifact. Returns fallback when missing.
   */
  readJson<T>(scanId: string, fileName: string, fallback: T): T {
    const file = path.join(this.scanDirectory(scanId), fileName);

    if (!fs.existsSync(file)) {
      return fallback;
    }

    try {
      return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
    } catch {
      return fallback;
    }
  }

  /**
   * All persisted findings for a scan across every check category.
   */
  getFindings(scanId: string): SecurityFinding[] {
    return [
      ...this.readJson<SecurityFinding[]>(scanId, 'headers.json', []),

      ...this.readJson<SecurityFinding[]>(scanId, 'cookies.json', []),

      ...this.readJson<SecurityFinding[]>(scanId, 'forms.json', []),

      ...this.readJson<SecurityFinding[]>(scanId, 'runtime.json', []),

      ...this.readJson<SecurityFinding[]>(scanId, 'ai-findings.json', [])
    ];
  }

  /**
   * Severity breakdown for a set of findings.
   */
  severityBreakdown(findings: SecurityFinding[]) {
    return {
      critical: findings.filter(f => f.severity === 'CRITICAL').length,

      high: findings.filter(f => f.severity === 'HIGH').length,

      medium: findings.filter(f => f.severity === 'MEDIUM').length,

      low: findings.filter(f => f.severity === 'LOW').length,

      info: findings.filter(f => f.severity === 'INFO').length
    };
  }

  /**
   * Risk score (0 best – 100 worst is inverted: 100 best) derived
   * from finding severities, same weights the frontend uses.
   */
  riskScore(findings: SecurityFinding[]): number {
    let score = 100;

    for (const finding of findings) {
      switch (finding.severity) {
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
    }

    return Math.max(score, 0);
  }

  /**
   * Path to the generated HTML report, or undefined when missing.
   */
  reportHtmlPath(scanId: string): string | undefined {
    const file = path.join(this.scanDirectory(scanId), 'report.html');

    return fs.existsSync(file) ? file : undefined;
  }

  /**
   * Screenshot descriptors for a scan (paths recorded in summary.json).
   */
  getScreenshots(scanId: string): Array<{ name: string; url: string; page: string }> {
    // Preferred: per-page screenshots recorded during the audit loop
    const perPage = this.readJson<Array<{ url: string; path: string }>>(
      scanId,
      'screenshots.json',
      []
    );

    if (perPage.length > 0) {
      return perPage.map(shot => {
        const fileName = path.basename(shot.path);

        return {
          name: fileName,

          url: `/storage/screenshots/${fileName}`,

          page: shot.url
        };
      });
    }

    // Fallback: single screenshot referenced in summary.json
    const summary = this.readJson<{ screenshot?: string; url?: string }>(
      scanId,
      'summary.json',
      {}
    );

    if (!summary.screenshot) {
      return [];
    }

    const fileName = path.basename(summary.screenshot);

    return [
      {
        name: fileName,

        url: `/storage/screenshots/${fileName}`,

        page: summary.url ?? ''
      }
    ];
  }
}

export const artifactService = new ArtifactService();
