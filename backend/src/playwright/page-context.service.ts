import { BrowserSession } from './browser.session.js';
import { logger } from '../config/logger.js';

export interface PageContext {
  url: string;

  title: string;

  html: string;

  visibleText: string;

  inlineScripts: string[];

  localStorage: Record<string, string>;

  sessionStorage: Record<string, string>;
}

export class PageContextService {
  private static readonly MAX_HTML = 40000;

  private static readonly MAX_TEXT = 12000;

  private static readonly MAX_SCRIPT = 20000;

  /**
   * Snapshot page content for the storage-secret runtime check and
   * the AI (Category 2) review.
   */
  async capture(session: BrowserSession): Promise<PageContext> {
    const page = session.page;

    logger.info(`Capturing page context for ${page.url()}`);

    // NOTE: this function is serialized and executed in the browser, so
    // it must be fully self-contained. We also avoid helper functions /
    // named arrows because the tsx/esbuild transform injects a `__name`
    // helper that is not defined in the page context.
    const data = (await page.evaluate(`
      (function () {
        var readStorage = function (storage) {
          var out = {};
          for (var i = 0; i < storage.length; i++) {
            var key = storage.key(i);
            if (key) { out[key] = storage.getItem(key) || ''; }
          }
          return out;
        };

        var scripts = document.querySelectorAll('script:not([src])');
        var inlineScripts = [];
        for (var s = 0; s < scripts.length; s++) {
          inlineScripts.push(scripts[s].textContent || '');
        }

        return {
          html: document.documentElement.outerHTML,
          visibleText: document.body ? document.body.innerText : '',
          inlineScripts: inlineScripts,
          localStorage: readStorage(window.localStorage),
          sessionStorage: readStorage(window.sessionStorage)
        };
      })()
    `)) as {
      html: string;
      visibleText: string;
      inlineScripts: string[];
      localStorage: Record<string, string>;
      sessionStorage: Record<string, string>;
    };

    return {
      url: page.url(),

      title: await page.title(),

      html: data.html.slice(0, PageContextService.MAX_HTML),

      visibleText: data.visibleText.slice(0, PageContextService.MAX_TEXT),

      inlineScripts: data.inlineScripts.map(script =>
        script.slice(0, PageContextService.MAX_SCRIPT)
      ),

      localStorage: data.localStorage,

      sessionStorage: data.sessionStorage
    };
  }
}

export const pageContextService = new PageContextService();
