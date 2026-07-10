import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-severity-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="severity" [class]="'severity--' + severity">
      {{ severity | titlecase }}
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .severity {
        display: inline-flex;
        align-items: center;
        padding: 0.3rem 0.6rem;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .severity--critical {
        color: #b91c1c;
        background: rgba(185, 28, 28, 0.12);
      }
      .severity--high {
        color: #d97706;
        background: rgba(217, 119, 6, 0.16);
      }
      .severity--medium {
        color: #7c3aed;
        background: rgba(124, 58, 237, 0.12);
      }
      .severity--low {
        color: #0f9d58;
        background: rgba(15, 157, 88, 0.12);
      }
    `
  ]
})
export class SeverityBadgeComponent {
  @Input() severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
}
