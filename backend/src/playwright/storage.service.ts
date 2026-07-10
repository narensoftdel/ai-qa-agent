import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger.js';

export class StorageService {
  private readonly baseDirectory = path.join(
    process.cwd(),

    'storage'
  );

  constructor() {
    if (!fs.existsSync(this.baseDirectory)) {
      fs.mkdirSync(this.baseDirectory, {
        recursive: true
      });
    }
  }

  createScanDirectory(scanId: string): string {
    const directory = path.join(
      this.baseDirectory,

      scanId
    );

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, {
        recursive: true
      });
    }

    return directory;
  }

  saveJson(
    scanId: string,

    fileName: string,

    data: unknown
  ): string {
    const directory = this.createScanDirectory(scanId);

    const file = path.join(
      directory,

      fileName
    );

    fs.writeFileSync(
      file,

      JSON.stringify(data, null, 2)
    );

    logger.info(`Saved ${file}`);

    return file;
  }
}

export const storageService = new StorageService();
