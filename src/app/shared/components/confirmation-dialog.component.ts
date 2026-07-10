import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog">
      <div class="dialog__icon">
        <mat-icon>warning</mat-icon>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="dialog__actions">
        <button mat-stroked-button (click)="cancel.emit()">{{ cancelLabel }}</button>
        <button mat-flat-button color="warn" (click)="confirm.emit()">{{ confirmLabel }}</button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .dialog {
        display: grid;
        justify-items: center;
        text-align: center;
        padding: 0.25rem 0.1rem 0.1rem;
      }
      .dialog__icon {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: rgba(220, 38, 38, 0.12);
        color: #b91c1c;
      }
      .dialog h3 {
        margin: 0.8rem 0 0.3rem;
      }
      .dialog p {
        margin: 0 0 1rem;
        color: color-mix(in srgb, var(--app-foreground) 72%, transparent);
      }
      .dialog__actions {
        display: flex;
        gap: 0.7rem;
      }
    `
  ]
})
export class ConfirmationDialogComponent {
  @Input() title = 'Confirm action';
  @Input() message = 'This action cannot be undone.';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmLabel = 'Confirm';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
