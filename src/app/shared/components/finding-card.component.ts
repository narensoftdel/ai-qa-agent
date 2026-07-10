import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SeverityBadgeComponent } from './severity-badge.component';

@Component({
  selector: 'app-finding-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, SeverityBadgeComponent],
  template: `
    <mat-card class="finding-card">
      <div class="finding-card__header">
        <div>
          <p class="finding-card__eyebrow">{{ category }}</p>
          <h3>{{ title }}</h3>
        </div>
        <app-severity-badge [severity]="severity"></app-severity-badge>
      </div>
      <p class="finding-card__description">{{ description }}</p>
      <div class="finding-card__meta">
        <span><mat-icon>location_on</mat-icon> {{ location }}</span>
        <span><mat-icon>schedule</mat-icon> {{ status }}</span>
      </div>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .finding-card {
        border-radius: 1rem;
        padding: 1rem;
        border: 1px solid var(--app-border);
        box-shadow: var(--app-shadow);
        background: var(--app-surface);
      }
      .finding-card__header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
      }
      .finding-card__eyebrow {
        margin: 0 0 0.2rem;
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--app-accent);
        font-weight: 700;
      }
      .finding-card h3 {
        margin: 0;
        font-size: 1rem;
      }
      .finding-card__description {
        margin: 0.8rem 0;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
      .finding-card__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        color: color-mix(in srgb, var(--app-foreground) 68%, transparent);
        font-size: 0.9rem;
      }
      .finding-card__meta span {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .finding-card__meta mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    `
  ]
})
export class FindingCardComponent {
  @Input() title = 'Broken access control';
  @Input() category = 'Authorization';
  @Input() severity: 'critical' | 'high' | 'medium' | 'low' = 'high';
  @Input() description = 'An admin endpoint is reachable without the expected role enforcement.';
  @Input() location = '/api/admin';
  @Input() status = 'Open';
}
