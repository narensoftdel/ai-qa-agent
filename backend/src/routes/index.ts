import { Router } from 'express';
import scannerRoutes from './scanner.routes.js';
import { dashboardController } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/health', (_, res) => {
  res.json({
    status: 'UP',

    application: 'Sentinel AI',

    version: '1.0.0'
  });
});

router.get('/dashboard', dashboardController.getDashboard.bind(dashboardController));

router.use('/scans', scannerRoutes);

export default router;
