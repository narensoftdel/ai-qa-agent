import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline">
      <div class="timeline__item" *ngFor="let item of items; let i = index">
        <div class="timeline__marker" [class.is-active]="i === 0"></div>
        <div class="timeline__content">
          <p class="timeline__title">{{ item.title }}</p>
          <p class="timeline__meta">{{ item.time }}</p>
          <p class="timeline__description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .timeline {
        display: grid;
        gap: 0.9rem;
      }
      .timeline__item {
        display: grid;
        grid-template-columns: 0.7rem 1fr;
        gap: 0.8rem;
        align-items: start;
      }
      .timeline__marker {
        width: 0.7rem;
        height: 0.7rem;
        margin-top: 0.35rem;
        border-radius: 50%;
        background: color-mix(in srgb, var(--app-accent) 25%, transparent);
        border: 2px solid var(--app-accent);
      }
      .timeline__marker.is-active {
        background: var(--app-accent);
      }
      .timeline__content {
        padding-bottom: 0.35rem;
      }
      .timeline__title {
        margin: 0;
        font-weight: 700;
      }
      .timeline__meta {
        margin: 0.2rem 0;
        font-size: 0.82rem;
        color: color-mix(in srgb, var(--app-foreground) 70%, transparent);
      }
      .timeline__description {
        margin: 0;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
    `
  ]
})
export class TimelineComponent {
  @Input() items: Array<{ title: string; time: string; description: string }> = [];
}
