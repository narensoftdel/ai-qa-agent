import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <button *ngIf="actionLabel" mat-stroked-button color="primary">{{ actionLabel }}</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .empty-state {
        display: grid;
        justify-items: center;
        text-align: center;
        padding: 2rem 1rem;
        border: 1px dashed var(--app-border);
        border-radius: 1rem;
        background: color-mix(in srgb, var(--app-surface) 85%, transparent);
      }
      .empty-state mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: var(--app-accent);
      }
      .empty-state h3 {
        margin: 0.6rem 0 0.25rem;
      }
      .empty-state p {
        margin: 0 0 0.9rem;
        max-width: 26rem;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing to show';
  @Input() description = 'There are no records for this view yet.';
  @Input() icon = 'inbox';
  @Input() actionLabel = '';
}
