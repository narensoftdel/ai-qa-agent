import fs from 'fs';
import path from 'path';

import { htmlReportService } from './html-report.service.js';
import { artifactService } from '../services/artifact.service.js';

export class ReportService {
  generate(scanId: string): string {
    const folder = path.join(process.cwd(), 'storage', scanId);

    const summary = JSON.parse(fs.readFileSync(path.join(folder, 'summary.json'), 'utf8'));

    // Single source of truth: every persisted finding category.
    const findings = artifactService.getFindings(scanId);

    return htmlReportService.generate(scanId, {
      ...summary,

      findings
    });
  }
}

export const reportService = new ReportService();
