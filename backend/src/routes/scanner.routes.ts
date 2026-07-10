import { Router } from 'express';
import { scannerController } from '../controllers/scanner.controller.js';

const router = Router();

router.post('/', scannerController.createScan.bind(scannerController));

router.get('/', scannerController.getAllScans.bind(scannerController));

router.get('/:id', scannerController.getScan.bind(scannerController));

router.delete('/:id', scannerController.cancelScan.bind(scannerController));

router.get('/:id/findings', scannerController.getFindings.bind(scannerController));

router.get('/:id/report', scannerController.getReport.bind(scannerController));

router.get('/:id/report/html', scannerController.getReportHtml.bind(scannerController));

router.get('/:id/screenshots', scannerController.getScreenshots.bind(scannerController));

router.get('/:id/console', scannerController.getConsoleLogs.bind(scannerController));

router.get('/:id/network', scannerController.getNetworkLogs.bind(scannerController));

router.get('/:id/pages', scannerController.getPages.bind(scannerController));

export default router;
