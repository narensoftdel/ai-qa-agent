// Ensures .env is loaded even if env.ts is imported before server.ts's
// top-level loader runs (e.g. in tests importing env directly).
import './load-env.js';

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  logLevel: process.env.LOG_LEVEL || 'info'
};
