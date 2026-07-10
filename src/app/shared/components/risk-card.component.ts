import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-risk-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  template: `
    <mat-card class="risk-card" [class]="'risk-card--' + severity">
      <div class="risk-card__header">
        <div>
          <p class="risk-card__eyebrow">Risk exposure</p>
          <h3>{{ title }}</h3>
        </div>
        <span class="risk-card__score">{{ score }}/100</span>
      </div>
      <mat-progress-bar mode="determinate" [value]="score"></mat-progress-bar>
      <p class="risk-card__description">{{ description }}</p>
      <div class="risk-card__footer">
        <span class="risk-card__badge">{{ severity | titlecase }}</span>
        <button mat-stroked-button color="warn">{{ actionLabel }}</button>
      </div>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .risk-card {
        border-radius: 1.1rem;
        padding: 1rem;
        border: 1px solid var(--app-border);
        box-shadow: var(--app-shadow);
        background: var(--app-surface);
      }
      .risk-card__header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
      }
      .risk-card__eyebrow {
        margin: 0 0 0.2rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.75rem;
        color: var(--app-accent);
        font-weight: 700;
      }
      .risk-card h3 {
        margin: 0;
        font-size: 1.05rem;
      }
      .risk-card__score {
        font-weight: 700;
        color: var(--app-accent);
      }
      .risk-card__description {
        margin: 0.9rem 0 0.95rem;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
      .risk-card__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.7rem;
      }
      .risk-card__badge {
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .risk-card--critical .risk-card__badge {
        color: #b91c1c;
        background: rgba(185, 28, 28, 0.12);
      }
      .risk-card--high .risk-card__badge {
        color: #d97706;
        background: rgba(217, 119, 6, 0.16);
      }
      .risk-card--medium .risk-card__badge {
        color: #7c3aed;
        background: rgba(124, 58, 237, 0.12);
      }
      .risk-card--low .risk-card__badge {
        color: #0f9d58;
        background: rgba(15, 157, 88, 0.12);
      }
    `
  ]
})
export class RiskCardComponent {
  @Input() title = 'Authentication weakness';
  @Input() score = 82;
  @Input() severity: 'critical' | 'high' | 'medium' | 'low' = 'high';
  @Input() description =
    'The application permits credential stuffing through a weak lockout policy.';
  @Input() actionLabel = 'Investigate';
}
