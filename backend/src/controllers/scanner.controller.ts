import { Request, Response } from 'express';
import { scannerService } from '../services/scanner.service.js';
import { artifactService } from '../services/artifact.service.js';
import { agentManager } from '../agent/agent.manager.js';

class ScannerController {
  async createScan(req: Request, res: Response) {
    try {
      const scan = scannerService.createScan(req.body);

      // Start scan in background
      agentManager.start(scan.id);

      res.status(202).json(scan);
    } catch (error) {
      res.status(500).json({
        message: 'Unable to start scan'
      });
    }
  }

  async getScan(req: Request, res: Response) {
    const scan = scannerService.getScan(req.params.id as any);

    if (!scan) {
      return res.status(404).json({
        message: 'Scan not found'
      });
    }

    return res.json(scan);
  }

  async getAllScans(req: Request, res: Response) {
    return res.json(scannerService.getAll());
  }

  /**
   * DELETE /api/scans/:id — cancel a scan
   */
  async cancelScan(req: Request, res: Response) {
    const id = req.params.id as string;

    const scan = scannerService.getScan(id);

    if (!scan) {
      return res.status(404).json({
        message: 'Scan not found'
      });
    }

    if (scan.status === 'PENDING' || scan.status === 'RUNNING') {
      scannerService.updateScan(id, {
        status: 'CANCELLED',

        currentStep: 'Cancelled',

        completedAt: new Date()
      });
    } else {
      // Finished scans are removed from history on delete
      scannerService.deleteScan(id);
    }

    return res.status(204).send();
  }

  /**
   * GET /api/scans/:id/findings
   */
  async getFindings(req: Request, res: Response) {
    const id = req.params.id as string;

    if (!scannerService.exists(id)) {
      return res.status(404).json({
        message: 'Scan not found'
      });
    }

    return res.json(artifactService.getFindings(id));
  }

  /**
   * GET /api/scans/:id/report — report summary as JSON
   */
  async getReport(req: Request, res: Response) {
    const id = req.params.id as string;

    const scan = scannerService.getScan(id);

    if (!scan) {
      return res.status(404).json({
        message: 'Scan not found'
      });
    }

    const findings = artifactService.getFindings(id);

    const breakdown = artifactService.severityBreakdown(findings);

    const summary = artifactService.readJson<{
      pagesDiscovered?: number;
    }>(id, 'summary.json', {});

    return res.json({
      scanId: id,

      applicationName: scan.url,

      generatedAt: scan.completedAt ?? scan.createdAt,

      riskScore: artifactService.riskScore(findings),

      totalPages: summary.pagesDiscovered ?? 0,

      totalFindings: findings.length,

      critical: breakdown.critical,

      high: breakdown.high,

      medium: breakdown.medium,

      low: breakdown.low,

      reportUrl: `/api/scans/${id}/report/html`,

      categories: artifactService.readJson(id, 'ai-analysis.json', null)
    });
  }

  /**
   * GET /api/scans/:id/report/html — generated HTML report
   */
  async getReportHtml(req: Request, res: Response) {
    const id = req.params.id as string;

    const file = artifactService.reportHtmlPath(id);

    if (!file) {
      return res.status(404).json({
        message: 'Report not found'
      });
    }

    return res.sendFile(file);
  }

  /**
   * GET /api/scans/:id/screenshots
   */
  async getScreenshots(req: Request, res: Response) {
    return res.json(artifactService.getScreenshots(req.params.id as string));
  }

  /**
   * GET /api/scans/:id/console
   */
  async getConsoleLogs(req: Request, res: Response) {
    return res.json(artifactService.readJson(req.params.id as string, 'console.json', []));
  }

  /**
   * GET /api/scans/:id/network
   */
  async getNetworkLogs(req: Request, res: Response) {
    return res.json(artifactService.readJson(req.params.id as string, 'network.json', []));
  }

  /**
   * GET /api/scans/:id/pages
   */
  async getPages(req: Request, res: Response) {
    return res.json(artifactService.readJson(req.params.id as string, 'pages.json', []));
  }
}

export const scannerController = new ScannerController();
