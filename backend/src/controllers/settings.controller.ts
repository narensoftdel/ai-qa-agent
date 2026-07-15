import { Request, Response } from 'express';

import { settingsService } from '../services/settings.service.js';
import { CHECK_CATALOG } from '../security/check-catalog.js';

class SettingsController {
  /**
   * GET /api/settings — current settings plus the full check catalog
   * so the frontend can render every checkpoint with its state.
   */
  async getSettings(_req: Request, res: Response) {
    return res.json({
      catalog: CHECK_CATALOG,

      settings: settingsService.get()
    });
  }

  /**
   * PUT /api/settings — persist enabled checks / AI toggle.
   */
  async updateSettings(req: Request, res: Response) {
    const updated = settingsService.update({
      enabledChecks: req.body?.enabledChecks,

      aiEnabled: req.body?.aiEnabled
    });

    return res.json({
      catalog: CHECK_CATALOG,

      settings: updated
    });
  }
}

export const settingsController = new SettingsController();
