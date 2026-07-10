// MUST be first: loads .env before any module reads process.env.
import './config/load-env.js';

import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { aiService } from './ai/ai.service.js';

app.listen(env.port, () => {
  logger.info(`🚀 Sentinel AI Backend Started`);

  logger.info(`Server : http://localhost:${env.port}`);

  logger.info(`Environment : ${env.nodeEnv}`);

  // Resolve the AI client now so the "OpenAI client initialized" /
  // "OPENAI_API_KEY not found" line prints at startup.
  aiService.init();
});
