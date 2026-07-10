import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { routeAnimations } from '../../shared/animations/route-animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div @routeAnimation class="page-card">
      <mat-card>
        <mat-card-header>
          <mat-card-title>About</mat-card-title>
          <mat-card-subtitle>Platform overview and version information</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            Sentinel AI is an enterprise-grade security operations experience built with Angular 19.
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
export class AboutComponent {}
