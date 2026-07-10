import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton"
      [style]="'grid-template-columns: repeat(' + columns + ', minmax(0, 1fr))'"
    >
      <div class="skeleton__block" *ngFor="let _ of getBlockItems()"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .skeleton {
        display: grid;
        gap: 0.75rem;
      }
      .skeleton__block {
        height: 0.95rem;
        border-radius: 999px;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--app-border) 60%, transparent),
          color-mix(in srgb, var(--app-border) 85%, transparent),
          color-mix(in srgb, var(--app-border) 60%, transparent)
        );
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite linear;
      }
      @keyframes shimmer {
        from {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
    `
  ]
})
export class SkeletonLoaderComponent {
  @Input() columns = 2;
  @Input() blocks = 6;

  protected getBlockItems(): number[] {
    return Array.from({ length: this.blocks });
  }
}
