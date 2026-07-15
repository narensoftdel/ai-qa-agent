import fs from 'fs';
import path from 'path';

import { logger } from '../config/logger.js';
import { DEFAULT_ENABLED_CHECK_IDS, isImplemented } from '../security/check-catalog.js';

export interface AppSettings {
  /** Check IDs that are enabled to run on scans. */
  enabledChecks: string[];

  /** Whether Category 2 (AI) checks should use OpenAI at all. */
  aiEnabled: boolean;
}

/**
 * File-backed global settings. A single JSON file under storage/ holds
 * the enabled-check preferences that every scan reads.
 */
export class SettingsService {
  private readonly file = path.join(process.cwd(), 'storage', 'settings.json');

  private cache?: AppSettings;

  private defaults(): AppSettings {
    return {
      enabledChecks: [...DEFAULT_ENABLED_CHECK_IDS],
      aiEnabled: true
    };
  }

  get(): AppSettings {
    if (this.cache) {
      return this.cache;
    }

    if (fs.existsSync(this.file)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(this.file, 'utf8')) as Partial<AppSettings>;

        this.cache = this.sanitize(parsed);

        return this.cache;
      } catch (error) {
        logger.warn(`Failed reading settings.json, using defaults: ${error}`);
      }
    }

    this.cache = this.defaults();

    return this.cache;
  }

  update(changes: Partial<AppSettings>): AppSettings {
    const merged = this.sanitize({ ...this.get(), ...changes });

    this.persist(merged);

    this.cache = merged;

    return merged;
  }

  /**
   * Keep only implemented, known check IDs so a stale/tampered file
   * can never enable something the engine can't run.
   */
  private sanitize(settings: Partial<AppSettings>): AppSettings {
    const defaults = this.defaults();

    const enabledChecks = Array.isArray(settings.enabledChecks)
      ? settings.enabledChecks.filter(id => isImplemented(id))
      : defaults.enabledChecks;

    return {
      enabledChecks,

      aiEnabled: typeof settings.aiEnabled === 'boolean' ? settings.aiEnabled : defaults.aiEnabled
    };
  }

  private persist(settings: AppSettings): void {
    const dir = path.dirname(this.file);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.file, JSON.stringify(settings, null, 2));

    logger.info('Settings saved.');
  }
}

export const settingsService = new SettingsService();
