import dotenv from 'dotenv';

/**
 * Side-effect module: loads .env into process.env as early as possible.
 *
 * This MUST be the first import in the process entrypoint (server.ts),
 * before any module that reads process.env at import time (e.g. the
 * AIService constructor reading OPENAI_API_KEY). ES module imports run
 * depth-first top-to-bottom, so if dotenv.config() runs inside a module
 * imported after app.js, the app's transitive imports have already read
 * an empty process.env.
 */
dotenv.config();
