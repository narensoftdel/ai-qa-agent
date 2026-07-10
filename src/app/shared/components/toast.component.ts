import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast" [class]="'toast--' + variant">
      <mat-icon>{{ icon }}</mat-icon>
      <div>
        <strong>{{ title }}</strong>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .toast {
        display: flex;
        align-items: start;
        gap: 0.7rem;
        padding: 0.9rem 1rem;
        border-radius: 0.9rem;
        border: 1px solid var(--app-border);
        background: var(--app-surface);
        box-shadow: var(--app-shadow);
        max-width: 24rem;
      }
      .toast strong {
        display: block;
        margin-bottom: 0.2rem;
      }
      .toast p {
        margin: 0;
        font-size: 0.92rem;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
      .toast--success {
        border-color: rgba(15, 157, 88, 0.3);
      }
      .toast--error {
        border-color: rgba(220, 38, 38, 0.28);
      }
      .toast--info {
        border-color: rgba(37, 99, 235, 0.28);
      }
    `
  ]
})
export class ToastComponent {
  @Input() title = 'Saved';
  @Input() message = 'Your changes were applied successfully.';
  @Input() variant: 'success' | 'error' | 'info' = 'info';
  @Input() icon = 'done';
}
