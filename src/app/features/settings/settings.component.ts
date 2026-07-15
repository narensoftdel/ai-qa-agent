import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { routeAnimations } from '../../shared/animations/route-animations';
import { SecurityChecksService } from '../../core/services/security-checks.service';
import { CheckDefinition } from '../../core/models/security-check.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div @routeAnimation class="page-shell">
      <mat-card class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-card__eyebrow">Workspace controls</p>
            <h2>Security Checkpoints</h2>
            <p class="settings-card__subtitle">
              Choose which validations run on every scan. Category 2 checks are performed by OpenAI.
            </p>
          </div>
          <div class="settings-card__badge">
            <mat-icon>shield</mat-icon>
            <span>{{ enabledCount() }} enabled</span>
          </div>
        </div>

        @if (loading()) {
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        }

        @if (error()) {
          <p class="state state--error">
            Unable to load settings. Is the backend running on http://localhost:3000?
          </p>
        }

        <!-- AI master toggle -->
        <mat-card class="panel-card panel-card--ai">
          <div class="ai-row">
            <div>
              <div class="panel-card__title">AI-assisted verification (Category 2)</div>
              <p class="panel-card__hint">
                When on, enabled Category 2 checks are evaluated by OpenAI automatically during each
                scan. If OpenAI is unavailable, those checks are skipped and noted in the report.
              </p>
            </div>
            <mat-slide-toggle [(ngModel)]="aiEnabled">OpenAI automation</mat-slide-toggle>
          </div>
        </mat-card>

        <!-- Category 1 -->
        <mat-card class="panel-card">
          <div class="panel-card__head">
            <div class="panel-card__title">Category 1 — Automated checks</div>
            <div class="bulk">
              <button mat-button type="button" (click)="setAll('category1', true)">
                Enable all
              </button>
              <button mat-button type="button" (click)="setAll('category1', false)">
                Disable all
              </button>
            </div>
          </div>

          <div class="check-grid">
            @for (check of category1(); track check.id) {
              <div class="check-item" [class.check-item--disabled]="!check.implemented">
                <mat-checkbox
                  [ngModel]="isEnabled(check.id)"
                  (ngModelChange)="toggle(check.id, $event)"
                  [disabled]="!check.implemented"
                >
                  <span class="check-item__label">{{ check.label }}</span>
                </mat-checkbox>
                @if (!check.implemented) {
                  <span class="coming-soon" matTooltip="Not yet implemented">Coming soon</span>
                }
                <p class="check-item__desc">{{ check.description }}</p>
              </div>
            }
          </div>
        </mat-card>

        <!-- Category 2 -->
        <mat-card class="panel-card">
          <div class="panel-card__head">
            <div class="panel-card__title">Category 2 — AI-assisted checks</div>
            <div class="bulk">
              <button mat-button type="button" (click)="setAll('category2', true)">
                Enable all
              </button>
              <button mat-button type="button" (click)="setAll('category2', false)">
                Disable all
              </button>
            </div>
          </div>

          <div class="check-grid">
            @for (check of category2(); track check.id) {
              <div class="check-item" [class.check-item--disabled]="!check.implemented">
                <mat-checkbox
                  [ngModel]="isEnabled(check.id)"
                  (ngModelChange)="toggle(check.id, $event)"
                  [disabled]="!check.implemented || !aiEnabled"
                >
                  <span class="check-item__label">{{ check.label }}</span>
                </mat-checkbox>
                @if (!check.implemented) {
                  <span class="coming-soon">Coming soon</span>
                }
                <p class="check-item__desc">{{ check.description }}</p>
              </div>
            }
          </div>
        </mat-card>

        <div class="settings-actions">
          <button mat-stroked-button type="button" (click)="reload()">Reset</button>
          <button
            mat-flat-button
            color="primary"
            type="button"
            [disabled]="saving()"
            (click)="save()"
          >
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    '.page-shell { display: grid; }',
    '.settings-card { border-radius: 1.35rem; padding: 0.2rem 0 0.4rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.settings-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.1rem 1.2rem 0.5rem; }',
    '.settings-card__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.settings-card__header h2 { margin: 0; font-size: 1.28rem; }',
    '.settings-card__subtitle { margin: 0.2rem 0 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.settings-card__badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 0.75rem; border-radius: 999px; background: var(--app-surface-muted); color: var(--app-accent); font-weight: 600; }',
    '.state { padding: 0.4rem 1.2rem; }',
    '.state--error { color: #dc2626; }',
    '.panel-card { border-radius: 1rem; padding: 1rem 1.1rem; margin: 0.6rem 1.2rem; background: color-mix(in srgb, var(--app-surface-muted) 90%, transparent); }',
    '.panel-card--ai { background: color-mix(in srgb, var(--app-accent) 8%, transparent); }',
    '.panel-card__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.8rem; }',
    '.panel-card__title { font-weight: 700; }',
    '.panel-card__hint { margin: 0.3rem 0 0; font-size: 0.85rem; color: color-mix(in srgb, var(--app-foreground) 68%, transparent); max-width: 60ch; }',
    '.ai-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }',
    '.bulk { display: flex; gap: 0.3rem; }',
    '.check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem 1.4rem; }',
    '.check-item { display: grid; gap: 0.15rem; }',
    '.check-item--disabled { opacity: 0.65; }',
    '.check-item__label { font-weight: 600; }',
    '.check-item__desc { margin: 0 0 0 1.9rem; font-size: 0.82rem; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); }',
    '.coming-soon { margin-left: 0.5rem; padding: 0.1rem 0.45rem; border-radius: 999px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: color-mix(in srgb, #f59e0b 20%, transparent); color: #b45309; }',
    '.settings-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 0.6rem 1.2rem 1.2rem; }',
    '@media (max-width: 800px) { .check-grid { grid-template-columns: 1fr; } .settings-card__header { flex-direction: column; align-items: flex-start; } }'
  ],
  animations: [routeAnimations]
})
export class SettingsComponent implements OnInit {
  private readonly checksService = inject(SecurityChecksService);

  private readonly snackBar = inject(MatSnackBar);

  protected readonly loading = this.checksService.loading;

  protected readonly saving = this.checksService.saving;

  protected readonly error = signal(false);

  // Working copy of the enabled set + AI toggle (edited before Save).
  protected readonly enabledSet = signal<Set<string>>(new Set());

  protected aiEnabled = true;

  protected readonly category1 = computed(() =>
    this.checksService.catalog().filter(c => c.category === 'category1')
  );

  protected readonly category2 = computed(() =>
    this.checksService.catalog().filter(c => c.category === 'category2')
  );

  protected readonly enabledCount = computed(() => this.enabledSet().size);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.error.set(false);

    this.checksService.load().subscribe({
      next: response => {
        this.enabledSet.set(new Set(response.settings.enabledChecks));
        this.aiEnabled = response.settings.aiEnabled;
      },
      error: err => {
        console.error(err);
        this.error.set(true);
      }
    });
  }

  isEnabled(id: string): boolean {
    return this.enabledSet().has(id);
  }

  toggle(id: string, enabled: boolean): void {
    const next = new Set(this.enabledSet());

    if (enabled) {
      next.add(id);
    } else {
      next.delete(id);
    }

    this.enabledSet.set(next);
  }

  setAll(category: 'category1' | 'category2', enabled: boolean): void {
    const next = new Set(this.enabledSet());

    const items = category === 'category1' ? this.category1() : this.category2();

    for (const check of items) {
      if (!check.implemented) {
        continue;
      }

      if (enabled) {
        next.add(check.id);
      } else {
        next.delete(check.id);
      }
    }

    this.enabledSet.set(next);
  }

  save(): void {
    this.checksService
      .save({
        enabledChecks: [...this.enabledSet()],
        aiEnabled: this.aiEnabled
      })
      .subscribe({
        next: response => {
          this.enabledSet.set(new Set(response.settings.enabledChecks));
          this.aiEnabled = response.settings.aiEnabled;
          this.snackBar.open('Settings saved', 'Dismiss', { duration: 2500 });
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Failed to save settings', 'Dismiss', { duration: 3500 });
        }
      });
  }
}
