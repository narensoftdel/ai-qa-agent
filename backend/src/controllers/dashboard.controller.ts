import { Request, Response } from 'express';
import { scannerService } from '../services/scanner.service.js';
import { artifactService } from '../services/artifact.service.js';

class DashboardController {
  /**
   * GET /api/dashboard — aggregated stats across all scans
   */
  async getDashboard(_req: Request, res: Response) {
    const scans = scannerService.getAll();

    const severity = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };

    let totalFindings = 0;

    let totalPages = 0;

    const riskScores: number[] = [];

    const recentFindings: Array<{
      id: string;
      title: string;
      severity: string;
      category: string;
      page: string;
    }> = [];

    for (const scan of scans) {
      const findings = artifactService.getFindings(scan.id);

      totalFindings += findings.length;

      const breakdown = artifactService.severityBreakdown(findings);

      severity.critical += breakdown.critical;
      severity.high += breakdown.high;
      severity.medium += breakdown.medium;
      severity.low += breakdown.low;
      severity.info += breakdown.info;

      const summary = artifactService.readJson<{
        pagesDiscovered?: number;
      }>(scan.id, 'summary.json', {});

      totalPages += summary.pagesDiscovered ?? 0;

      if (scan.status === 'COMPLETED') {
        riskScores.push(artifactService.riskScore(findings));

        for (const finding of findings) {
          recentFindings.push({
            id: finding.id,

            title: finding.title,

            severity: finding.severity,

            category: finding.category,

            page: finding.page
          });
        }
      }
    }

    const severityRank: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
      INFO: 4
    };

    recentFindings.sort(
      (a, b) => (severityRank[a.severity] ?? 5) - (severityRank[b.severity] ?? 5)
    );

    const recentScans = [...scans]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(scan => {
        const findings = artifactService.getFindings(scan.id);

        return {
          id: scan.id,

          url: scan.url,

          status: scan.status,

          progress: scan.progress,

          currentStep: scan.currentStep,

          findings: scan.findings,

          riskScore: scan.status === 'COMPLETED' ? artifactService.riskScore(findings) : null,

          createdAt: scan.createdAt,

          startedAt: scan.startedAt,

          completedAt: scan.completedAt
        };
      });

    return res.json({
      totalScans: scans.length,

      pendingScans: scans.filter(s => s.status === 'PENDING').length,

      runningScans: scans.filter(s => s.status === 'RUNNING').length,

      completedScans: scans.filter(s => s.status === 'COMPLETED').length,

      failedScans: scans.filter(s => s.status === 'FAILED').length,

      cancelledScans: scans.filter(s => s.status === 'CANCELLED').length,

      totalPages,

      totalFindings,

      severity,

      averageRiskScore:
        riskScores.length === 0
          ? 0
          : Math.round(riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length),

      recentScans,

      recentFindings: recentFindings.slice(0, 5)
    });
  }
}

export const dashboardController = new DashboardController();
