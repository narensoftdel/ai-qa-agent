import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [PageHeaderComponent, MatCardModule, MatIconModule],
  template: `
    <app-page-header
      title="Operations"
      subtitle="Runbook orchestration and incident workflows."
      icon="track_changes"
    ></app-page-header>

    <section class="ops-grid">
      <mat-card class="ops-card">
        <div class="ops-card__header">
          <mat-icon>playlist_add_check</mat-icon>
          <h3>Incident queue</h3>
        </div>
        <p>7 critical incidents require coordinated review.</p>
      </mat-card>
      <mat-card class="ops-card">
        <div class="ops-card__header">
          <mat-icon>sync_alt</mat-icon>
          <h3>Automation health</h3>
        </div>
        <p>Playbooks executed successfully in the last 24 hours.</p>
      </mat-card>
    </section>
  `,
  styles: [
    '.ops-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }',
    '.ops-card { padding: 1.1rem; border-radius: 1.25rem; background: var(--app-surface); box-shadow: var(--app-shadow); }',
    '.ops-card__header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.55rem; }',
    '.ops-card__header h3 { margin: 0; font-size: 1rem; }',
    '.ops-card p { margin: 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.ops-card mat-icon { color: var(--app-accent); }'
  ]
})
export class OperationsComponent {}
