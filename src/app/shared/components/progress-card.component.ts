import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="progress-card">
      <div class="progress-card__header">
        <div>
          <p class="progress-card__eyebrow">Workflow</p>
          <h3>{{ title }}</h3>
        </div>
        <div class="progress-card__ring" [style.--progress]="progress + '%'">
          <span>{{ progress }}%</span>
        </div>
      </div>
      <p class="progress-card__subtitle">{{ subtitle }}</p>
      <ul class="progress-card__steps">
        <li *ngFor="let step of steps">{{ step }}</li>
      </ul>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .progress-card {
        border-radius: 1rem;
        padding: 1rem;
        border: 1px solid var(--app-border);
        box-shadow: var(--app-shadow);
        background: var(--app-surface);
      }
      .progress-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
      .progress-card__eyebrow {
        margin: 0 0 0.2rem;
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--app-accent);
        font-weight: 700;
      }
      .progress-card h3 {
        margin: 0;
        font-size: 1rem;
      }
      .progress-card__ring {
        display: grid;
        place-items: center;
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 50%;
        background: conic-gradient(
          var(--app-accent) 0 var(--progress),
          color-mix(in srgb, var(--app-accent) 15%, transparent) var(--progress) 100%
        );
        color: var(--app-accent);
        font-weight: 700;
      }
      .progress-card__subtitle {
        margin: 0.8rem 0;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
      .progress-card__steps {
        margin: 0;
        padding-left: 1.1rem;
        display: grid;
        gap: 0.35rem;
        color: color-mix(in srgb, var(--app-foreground) 70%, transparent);
      }
    `
  ]
})
export class ProgressCardComponent {
  @Input() title = 'Scan progress';
  @Input() progress = 72;
  @Input() subtitle = 'Collecting evidence and evaluating attack surface.';
  @Input() steps: string[] = ['Crawl known routes', 'Inspect headers', 'Evaluate findings'];
}
