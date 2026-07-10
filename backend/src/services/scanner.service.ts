import { randomUUID } from 'crypto';

export type ScanStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Scan {
  id: string;

  url: string;

  username?: string;

  password?: string;

  maxDepth: number;

  maxPages: number;

  pagesScanned: number;

  status: ScanStatus;

  progress: number;

  currentStep: string;

  findings: number;

  createdAt: Date;

  startedAt?: Date;

  completedAt?: Date;

  error?: string;
}

class ScannerService {
  private scans = new Map<string, Scan>();

  /**
   * Create new scan
   */
  createScan(data: {
    url: string;

    username?: string;

    password?: string;

    maxDepth?: number;

    maxPages?: number;
  }): Scan {
    const scan: Scan = {
      id: randomUUID(),

      url: data.url,

      username: data.username,

      password: data.password,

      maxDepth: this.clamp(data.maxDepth, 1, 10, 3),

      maxPages: this.clamp(data.maxPages, 1, 5000, 100),

      pagesScanned: 0,

      status: 'PENDING',

      progress: 0,

      currentStep: 'Waiting',

      findings: 0,

      createdAt: new Date()
    };

    this.scans.set(scan.id, scan);

    return scan;
  }

  /**
   * Clamp an optional numeric input into a valid range.
   */
  private clamp(value: number | undefined, min: number, max: number, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return fallback;
    }

    return Math.min(Math.max(value, min), max);
  }

  /**
   * Get scan by id
   */
  getScan(id: string): Scan | undefined {
    return this.scans.get(id);
  }

  /**
   * Get all scans
   */
  getAll(): Scan[] {
    return [...this.scans.values()];
  }

  /**
   * Update scan
   */
  updateScan(
    id: string,

    updates: Partial<Scan>
  ): Scan | undefined {
    const scan = this.scans.get(id);

    if (!scan) {
      return undefined;
    }

    // A cancelled scan stays cancelled even if the background
    // agent keeps reporting progress afterwards.
    if (scan.status === 'CANCELLED') {
      return scan;
    }

    const updatedScan: Scan = {
      ...scan,

      ...updates
    };

    this.scans.set(id, updatedScan);

    return updatedScan;
  }

  /**
   * Delete scan
   */
  deleteScan(id: string): boolean {
    return this.scans.delete(id);
  }

  /**
   * Check if scan exists
   */
  exists(id: string): boolean {
    return this.scans.has(id);
  }

  /**
   * Clear all scans
   */
  clear(): void {
    this.scans.clear();
  }
}

export const scannerService = new ScannerService();
