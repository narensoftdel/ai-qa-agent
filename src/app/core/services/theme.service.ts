import { computed, Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeModeSignal = signal<AppTheme>('light');

  readonly themeMode = this.themeModeSignal.asReadonly();
  readonly isDarkMode = computed(() => this.themeModeSignal() === 'dark');

  constructor() {
    const storedTheme = this.readStoredTheme();
    this.setTheme(storedTheme ?? 'light');
  }

  setTheme(theme: AppTheme): void {
    this.themeModeSignal.set(theme);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-theme', theme === 'dark');
      document.documentElement.style.colorScheme = theme;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sentinel-theme', theme);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  private readStoredTheme(): AppTheme | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedTheme = window.localStorage.getItem('sentinel-theme');
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null;
  }
}
