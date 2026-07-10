import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner" role="status" aria-label="Loading">
      <mat-spinner diameter="44"></mat-spinner>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .spinner {
        display: grid;
        place-items: center;
        padding: 1rem;
      }
    `
  ]
})
export class LoadingSpinnerComponent {}
