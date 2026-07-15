import { BrowserSession } from './browser.session.js';
import { logger } from '../config/logger.js';

export interface NetworkRequest {
  method: string;

  url: string;

  resourceType: string;

  status?: number;

  contentType?: string;

  failure?: string;
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

    // Attach status/content-type once the response arrives.
    session.page.on('response', response => {
      const entry = this.findLatest(response.url());

      if (entry) {
        entry.status = response.status();

        entry.contentType = response.headers()['content-type'];
      }
    });

    session.page.on('requestfailed', request => {
      const entry = this.findLatest(request.url());

      if (entry) {
        entry.failure = request.failure()?.errorText ?? 'failed';
      }
    });
  }

  private findLatest(url: string): NetworkRequest | undefined {
    for (let i = this.requests.length - 1; i >= 0; i--) {
      if (this.requests[i].url === url) {
        return this.requests[i];
      }
    }

    return undefined;
  }

  getRequests(): NetworkRequest[] {
    return this.requests;
  }

  clear(): void {
    this.requests.length = 0;
  }
}

export const networkService = new NetworkService();
