export interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: string;
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/scan/new', label: 'New Scan', icon: 'add_circle' },
  { path: '/scan/history', label: 'Scan History', icon: 'history' },
  { path: '/findings', label: 'Findings', icon: 'bug_report' },
  { path: '/reports', label: 'Reports', icon: 'description' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
  { path: '/help', label: 'Help', icon: 'help_outline' },
  { path: '/about', label: 'About', icon: 'info' }
];
