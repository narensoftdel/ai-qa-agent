import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AppSettings } from '../models/settings.model';
import { simulateApiCall } from '../utils/mock-api.util';

const SETTINGS_STORAGE_KEY = 'sentinel-settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'Dark',
  language: 'English',
  defaultBrowser: 'Chrome',
  aiProvider: 'OpenAI',
  apiKey: '',
  concurrentScans: 4,
  emailNotifications: true,
  desktopNotifications: true,
  autoReportDelivery: false
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly settingsSignal = signal<AppSettings>(
    this.readStoredSettings() ?? DEFAULT_SETTINGS
  );
  private readonly savingSignal = signal(false);

  readonly settings = this.settingsSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();

  updateSettings(changes: Partial<AppSettings>): Observable<AppSettings> {
    const updated: AppSettings = { ...this.settingsSignal(), ...changes };
    this.savingSignal.set(true);

    return simulateApiCall(updated, 450).pipe(
      tap(settings => {
        this.settingsSignal.set(settings);
        this.savingSignal.set(false);
        this.persistSettings(settings);
      })
    );
  }

  resetSettings(): Observable<AppSettings> {
    this.savingSignal.set(true);

    return simulateApiCall(DEFAULT_SETTINGS, 300).pipe(
      tap(settings => {
        this.settingsSignal.set(settings);
        this.savingSignal.set(false);
        this.persistSettings(settings);
      })
    );
  }

  private persistSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  private readStoredSettings(): AppSettings | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AppSettings;
    } catch {
      return null;
    }
  }
}
