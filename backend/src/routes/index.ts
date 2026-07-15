import { Router } from 'express';
import scannerRoutes from './scanner.routes.js';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { settingsController } from '../controllers/settings.controller.js';

const router = Router();

router.get('/health', (_, res) => {
  res.json({
    status: 'UP',

    application: 'Sentinel AI',

    version: '1.0.0'
  });
});

router.get('/dashboard', dashboardController.getDashboard.bind(dashboardController));

router.get('/settings', settingsController.getSettings.bind(settingsController));

router.put('/settings', settingsController.updateSettings.bind(settingsController));

router.use('/scans', scannerRoutes);

export default router;
