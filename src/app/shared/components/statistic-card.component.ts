import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [class]="'stat-card--' + trend">
      <div class="stat-card__icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="stat-card__content">
        <p class="stat-card__title">{{ title }}</p>
        <h3 class="stat-card__value">{{ value }}</h3>
        <div class="stat-card__footer">
          <span
            class="stat-card__delta"
            [class]="
              trend === 'up' ? 'is-positive' : trend === 'down' ? 'is-negative' : 'is-neutral'
            "
          >
            {{ delta }}
          </span>
          <span class="stat-card__subtitle">{{ subtitle }}</span>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .stat-card {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1.1rem 1.15rem;
        border-radius: 1.1rem;
        background: var(--app-surface);
        border: 1px solid var(--app-border);
        box-shadow: var(--app-shadow);
      }
      .stat-card__icon {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border-radius: 0.95rem;
        background: color-mix(in srgb, var(--app-accent) 15%, transparent);
        color: var(--app-accent);
      }
      .stat-card__title {
        margin: 0 0 0.3rem;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: color-mix(in srgb, var(--app-foreground) 70%, transparent);
      }
      .stat-card__value {
        margin: 0;
        font-size: 1.45rem;
        font-weight: 700;
      }
      .stat-card__footer {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
        margin-top: 0.3rem;
      }
      .stat-card__delta {
        font-size: 0.85rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 999px;
      }
      .stat-card__subtitle {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--app-foreground) 68%, transparent);
      }
      .is-positive {
        color: #0f9d58;
        background: rgba(15, 157, 88, 0.12);
      }
      .is-negative {
        color: #dc2626;
        background: rgba(220, 38, 38, 0.12);
      }
      .is-neutral {
        color: var(--app-accent);
        background: rgba(37, 99, 235, 0.12);
      }
    `
  ]
})
export class StatisticCardComponent {
  @Input() title = 'Metric';
  @Input() value = '—';
  @Input() subtitle = 'Last 24 hours';
  @Input() delta = '+12%';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() icon = 'insights';
}
