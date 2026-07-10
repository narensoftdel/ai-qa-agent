import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/components/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            module => module.DashboardComponent
          )
      },
      {
        path: 'scan/new',
        loadComponent: () =>
          import('./features/scan/new-scan/new-scan.component').then(
            module => module.NewScanComponent
          )
      },
      {
        path: 'scan/history',
        loadComponent: () =>
          import('./features/scan/scan-history/scan-history.component').then(
            module => module.ScanHistoryComponent
          )
      },
      {
        path: 'scan/result/:scanId',
        loadComponent: () =>
          import('./features/scan/scan-result/scan-result.component').then(
            module => module.ScanResultComponent
          )
      },
      {
        path: 'findings',
        loadComponent: () =>
          import('./features/findings/findings.component').then(module => module.FindingsComponent)
      },
      {
        path: 'page-details',
        loadComponent: () =>
          import('./features/page-details/page-details.component').then(
            module => module.PageDetailsComponent
          )
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(module => module.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(module => module.SettingsComponent)
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./features/help/help.component').then(module => module.HelpComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then(module => module.AboutComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
