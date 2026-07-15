export type CheckCategory = 'category1' | 'category2';

export interface CheckDefinition {
  id: string;
  label: string;
  category: CheckCategory;
  implemented: boolean;
  description: string;
}

export interface SecuritySettings {
  enabledChecks: string[];
  aiEnabled: boolean;
}

export interface SecuritySettingsResponse {
  catalog: CheckDefinition[];
  settings: SecuritySettings;
}
