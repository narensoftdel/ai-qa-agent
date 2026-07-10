import fs from 'fs';
import path from 'path';
import { BrowserSession } from './browser.session';
import { logger } from '../config/logger.js';

export class ScreenshotService {
  private readonly outputDirectory = path.join(process.cwd(), 'storage', 'screenshots');

  constructor() {
    if (!fs.existsSync(this.outputDirectory)) {
      fs.mkdirSync(this.outputDirectory, {
        recursive: true
      });
    }
  }

  async capture(
    session: BrowserSession,

    pageName = 'page'
  ): Promise<string> {
    const timestamp = Date.now();

    const fileName = `${pageName}-${timestamp}.png`;

    const filePath = path.join(
      this.outputDirectory,

      fileName
    );

    await session.page.screenshot({
      path: filePath,

      fullPage: true
    });

    session.incrementScreenshotCount();

    logger.info(`Screenshot Saved : ${filePath}`);

    return filePath;
  }
}

export const screenshotService = new ScreenshotService();
