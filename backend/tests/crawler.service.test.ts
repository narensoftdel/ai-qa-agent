import test from 'node:test';
import assert from 'node:assert/strict';

import { CrawlerService } from '../src/services/crawler.service.js';

test('uses a lightweight navigation wait while crawling pages', async () => {
  const service = new CrawlerService();
  const gotoCalls: Array<{ waitUntil?: string; timeout?: number }> = [];

  const page: any = {
    url: () => 'https://example.com/',
    title: async () => 'Home',
    $$eval: async () => [],
    evaluate: async (_fn: Function) => ['/about'],
    goto: async (_url: string, options?: { waitUntil?: string; timeout?: number }) => {
      gotoCalls.push(options ?? {});
    }
  };

  page.evaluate = async () => ['/about'];

  await service.crawl({ page } as any, 5, 1);

  assert.equal(gotoCalls.length, 2);
  assert.equal(gotoCalls[0].waitUntil, 'domcontentloaded');
  assert.equal(gotoCalls[0].timeout, 8000);
  assert.equal(gotoCalls[1].waitUntil, 'domcontentloaded');
  assert.equal(gotoCalls[1].timeout, 8000);
});
