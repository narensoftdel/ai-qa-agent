import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-threats',
  standalone: true,
  imports: [PageHeaderComponent, MatCardModule, MatIconModule],
  template: `
    <app-page-header
      title="Threats"
      subtitle="Threat intelligence and anomaly review."
      icon="shield"
    ></app-page-header>

    <section class="threats-grid">
      <mat-card class="threats-card">
        <div class="threats-card__header">
          <mat-icon>warning_amber</mat-icon>
          <h3>High confidence alerts</h3>
        </div>
        <p>Two alerts were correlated across endpoint and identity telemetry.</p>
      </mat-card>
      <mat-card class="threats-card">
        <div class="threats-card__header">
          <mat-icon>psychology</mat-icon>
          <h3>AI summarization</h3>
        </div>
        <p>Suspicious authentication activity has been grouped into a single case.</p>
      </mat-card>
    </section>
  `,
  styles: [
    '.threats-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }',
    '.threats-card { padding: 1.1rem; border-radius: 1.25rem; background: var(--app-surface); box-shadow: var(--app-shadow); }',
    '.threats-card__header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.55rem; }',
    '.threats-card__header h3 { margin: 0; font-size: 1rem; }',
    '.threats-card p { margin: 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.threats-card mat-icon { color: var(--app-accent); }'
  ]
})
export class ThreatsComponent {}
