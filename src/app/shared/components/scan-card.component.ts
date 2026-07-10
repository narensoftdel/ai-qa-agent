import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-scan-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  template: `
    <mat-card class="scan-card">
      <div class="scan-card__header">
        <div>
          <p class="scan-card__eyebrow">Scan run</p>
          <h3>{{ title }}</h3>
        </div>
        <span class="scan-card__status">{{ status }}</span>
      </div>
      <div class="scan-card__body">
        <div class="scan-card__meta">
          <span><mat-icon>public</mat-icon> {{ target }}</span>
          <span><mat-icon>schedule</mat-icon> {{ duration }}</span>
        </div>
        <mat-progress-bar mode="determinate" [value]="progress"></mat-progress-bar>
        <div class="scan-card__footer">
          <span>{{ progress }}% complete</span>
          <button mat-stroked-button>View details</button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .scan-card {
        border-radius: 1rem;
        padding: 1rem;
        border: 1px solid var(--app-border);
        box-shadow: var(--app-shadow);
        background: var(--app-surface);
      }
      .scan-card__header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
      }
      .scan-card__eyebrow {
        margin: 0 0 0.2rem;
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--app-accent);
        font-weight: 700;
      }
      .scan-card h3 {
        margin: 0;
        font-size: 1rem;
      }
      .scan-card__status {
        font-weight: 700;
        color: #0f9d58;
      }
      .scan-card__body {
        margin-top: 0.85rem;
        display: grid;
        gap: 0.8rem;
      }
      .scan-card__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        color: color-mix(in srgb, var(--app-foreground) 68%, transparent);
        font-size: 0.9rem;
      }
      .scan-card__meta span {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
      }
      .scan-card__meta mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
      .scan-card__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.8rem;
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--app-foreground) 70%, transparent);
      }
    `
  ]
})
export class ScanCardComponent {
  @Input() title = 'Full-stack web application';
  @Input() status = 'In progress';
  @Input() target = 'https://app.example.com';
  @Input() duration = '06:42';
  @Input() progress = 67;
}
