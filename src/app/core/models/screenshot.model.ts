export type ScreenshotViewport = 'Desktop' | 'Tablet' | 'Mobile';

export interface Screenshot {
  id: string;
  pageId: string;
  scanId: string;
  title: string;
  viewport: ScreenshotViewport;
  capturedAt: string;
  thumbnailUrl: string;
}
