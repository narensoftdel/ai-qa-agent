import { logger } from '../config/logger.js';

export interface ScanJob {
  scanId: string;

  url: string;

  username?: string;

  password?: string;
}

export class ScanQueue {
  private readonly queue: ScanJob[] = [];

  enqueue(job: ScanJob): void {
    logger.info(`Queued Scan : ${job.scanId}`);

    this.queue.push(job);
  }

  dequeue(): ScanJob | undefined {
    return this.queue.shift();
  }

  peek(): ScanJob | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue.length = 0;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

export const scanQueue = new ScanQueue();
