"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const crawler_service_js_1 = require("../src/services/crawler.service.js");
(0, node_test_1.default)('uses a lightweight navigation wait while crawling pages', async () => {
    const service = new crawler_service_js_1.CrawlerService();
    const gotoCalls = [];
    const page = {
        url: () => 'https://example.com/',
        title: async () => 'Home',
        $$eval: async () => ['https://example.com/about'],
        goto: async (_url, options) => {
            gotoCalls.push(options ?? {});
        }
    };
    await service.crawl({ page }, 5, 1);
    strict_1.default.equal(gotoCalls.length, 1);
    strict_1.default.equal(gotoCalls[0].waitUntil, 'domcontentloaded');
    strict_1.default.equal(gotoCalls[0].timeout, 15000);
});
