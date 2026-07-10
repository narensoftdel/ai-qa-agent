import { Screenshot, ScreenshotViewport } from '../models/screenshot.model';
import { MOCK_PAGES } from './pages.mock';

function viewportFor(pageIndex: number): ScreenshotViewport {
  if (pageIndex % 7 === 0) {
    return 'Mobile';
  }
  if (pageIndex % 5 === 0) {
    return 'Tablet';
  }
  return 'Desktop';
}

/** One capture per crawled page, biased toward desktop viewports with occasional tablet/mobile passes. */
export const MOCK_SCREENSHOTS: Screenshot[] = MOCK_PAGES.map((page, pageIndex) => {
  const viewport = viewportFor(pageIndex);

  return {
    id: `scr${pageIndex + 1}`,
    pageId: page.id,
    scanId: page.scanId,
    title: page.title,
    viewport,
    capturedAt: page.discoveredAt,
    thumbnailUrl: `mock://screenshots/${page.id}-${viewport.toLowerCase()}.png`
  };
});
