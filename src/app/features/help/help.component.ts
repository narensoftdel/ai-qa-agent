import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { routeAnimations } from '../../shared/animations/route-animations';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div @routeAnimation class="page-card">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Help</mat-card-title>
          <mat-card-subtitle>Support guidance and runbooks</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            Access documentation, playbooks, and service desk procedures directly from the console.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    '.page-card { display: grid; gap: 1rem; }',
    'mat-card { border-radius: 1.2rem; padding: 0.4rem 0; }'
  ],
  animations: [routeAnimations]
})
export class HelpComponent {}
