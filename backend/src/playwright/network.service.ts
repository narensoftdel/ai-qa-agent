import { BrowserSession } from './browser.session.js';
import { logger } from '../config/logger.js';

export interface NetworkRequest {
  method: string;

  url: string;

  resourceType: string;
}

export class NetworkService {
  private readonly requests: NetworkRequest[] = [];

  start(session: BrowserSession): void {
    logger.info('Capturing network requests');

    session.page.on('request', request => {
      this.requests.push({
        method: request.method(),

        url: request.url(),

        resourceType: request.resourceType()
      });
    });
  }

  getRequests(): NetworkRequest[] {
    return this.requests;
  }

  clear(): void {
    this.requests.length = 0;
  }
}

export const networkService = new NetworkService();
