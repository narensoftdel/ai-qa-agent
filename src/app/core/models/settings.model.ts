export type ThemePreference = 'Dark' | 'Light' | 'System';
export type AppLanguage = 'English' | 'German' | 'French';
export type DefaultBrowser = 'Chrome' | 'Edge' | 'Firefox';
export type AiProvider = 'OpenAI' | 'Azure OpenAI' | 'Anthropic';

export interface AppSettings {
  theme: ThemePreference;
  language: AppLanguage;
  defaultBrowser: DefaultBrowser;
  aiProvider: AiProvider;
  apiKey: string;
  concurrentScans: number;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  autoReportDelivery: boolean;
}
