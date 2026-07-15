import { Component, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { routeAnimations } from '../../../shared/animations/route-animations';
import { ScannerService } from '../../../core/services';
import { interval, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

interface ProgressStep {
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'complete';
}

@Component({
  selector: 'app-new-scan',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  template: `
    <div @routeAnimation class="page-shell">
      <mat-card class="scan-card">
        @if (!isScanning()) {
          <div class="scan-card__header">
            <div>
              <p class="scan-card__eyebrow">Enterprise scan setup</p>
              <h2>New Security Scan</h2>
              <p class="scan-card__subtitle">
                Configure a targeted assessment for web applications and APIs.
              </p>
            </div>
            <div class="scan-card__badge">
              <mat-icon>verified_user</mat-icon>
              <span>Policy-ready</span>
            </div>
          </div>

          <form [formGroup]="scanForm" class="scan-form" (ngSubmit)="submitScan()">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Application URL</mat-label>
                <input
                  matInput
                  formControlName="applicationUrl"
                  placeholder="https://app.example.com"
                />
                @if (scanForm.get('applicationUrl')?.hasError('required')) {
                  <mat-error>Application URL is required.</mat-error>
                }
                @if (scanForm.get('applicationUrl')?.hasError('pattern')) {
                  <mat-error>Enter a valid URL.</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="svc-security" />
                @if (scanForm.get('username')?.hasError('required')) {
                  <mat-error>Username is required.</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" placeholder="••••••••" />
                @if (scanForm.get('password')?.hasError('required')) {
                  <mat-error>Password is required.</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="scan-form__actions">
              <button mat-stroked-button type="button" (click)="resetForm()">Cancel</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="scanForm.invalid">
                <mat-icon>play_arrow</mat-icon>
                Start Scan
              </button>
            </div>

            <div class="scan-form__status">
              <span>Form status:</span>
              <strong>{{ formStatus() }}</strong>
            </div>
          </form>
        } @else {
          <div class="progress-card">
            <div class="progress-card__header">
              <div>
                <p class="scan-card__eyebrow">Live scan activity</p>
                <h2>Security Scan in Progress</h2>
                <p class="scan-card__subtitle">
                  Monitoring the target environment with enterprise-grade telemetry.
                </p>
              </div>
              <div class="scan-card__badge">
                <mat-icon>sync</mat-icon>
                <span>{{ statusMessage() }}</span>
              </div>
            </div>

            <div class="progress-summary">
              <div class="progress-summary__item">
                <span>Overall progress</span>
                <strong>{{ scanProgress() }}%</strong>
              </div>
              <div class="progress-summary__item">
                <span>Current page</span>
                <strong>{{ currentPage() }}</strong>
              </div>
              <div class="progress-summary__item">
                <span>Estimated time</span>
                <strong>{{ estimatedTime() }}</strong>
              </div>
            </div>

            <mat-progress-bar mode="determinate" [value]="scanProgress()"></mat-progress-bar>

            <div class="timeline-grid">
              <div class="timeline-card">
                <div class="timeline-card__title">Animated timeline</div>
                <div class="timeline">
                  @for (step of timeline(); track step.label) {
                    <div
                      class="timeline__item"
                      [class.timeline__item--active]="step.status === 'active'"
                      [class.timeline__item--complete]="step.status === 'complete'"
                    >
                      <div class="timeline__dot">
                        @if (step.status === 'complete') {
                          <mat-icon>check</mat-icon>
                        } @else if (step.status === 'active') {
                          <mat-icon>radio_button_checked</mat-icon>
                        } @else {
                          <mat-icon>radio_button_unchecked</mat-icon>
                        }
                      </div>
                      <div>
                        <div class="timeline__label">{{ step.label }}</div>
                        <div class="timeline__detail">{{ step.detail }}</div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="timeline-card">
                <div class="timeline-card__title">Console window</div>
                <div class="console-window">
                  @for (entry of consoleEntries(); track entry) {
                    <div class="console-window__entry">{{ entry }}</div>
                  }
                </div>
              </div>
            </div>

            <div class="progress-card__actions">
              <button mat-stroked-button type="button" (click)="resetForm()">Stop Scan</button>
              <button mat-flat-button color="primary" type="button" (click)="resetForm()">
                View Report
              </button>
            </div>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [
    '.page-shell { display: grid; }',
    '.scan-card { border-radius: 1.35rem; padding: 0.2rem 0 0.4rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.scan-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.1rem 1.2rem 0.5rem; }',
    '.scan-card__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.scan-card__header h2 { margin: 0; font-size: 1.28rem; }',
    '.scan-card__subtitle { margin: 0.2rem 0 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.scan-card__badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 0.75rem; border-radius: 999px; background: var(--app-surface-muted); color: var(--app-accent); font-weight: 600; }',
    '.scan-form { display: grid; gap: 1rem; padding: 0.4rem 1.2rem 1.2rem; }',
    '.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }',
    'mat-form-field { width: 100%; }',
    '.scan-form__actions { display: flex; justify-content: flex-end; gap: 0.75rem; }',
    '.scan-form__status { display: flex; align-items: center; gap: 0.4rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.progress-card { display: grid; gap: 1rem; padding: 0.4rem 1.2rem 1.2rem; }',
    '.progress-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; }',
    '.progress-summary__item { padding: 0.9rem 1rem; border-radius: 1rem; background: var(--app-surface-muted); display: flex; flex-direction: column; gap: 0.2rem; }',
    '.progress-summary__item span { font-size: 0.78rem; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); text-transform: uppercase; letter-spacing: 0.08em; }',
    '.timeline-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1rem; }',
    '.timeline-card { padding: 1rem; border-radius: 1rem; background: color-mix(in srgb, var(--app-surface-muted) 82%, transparent); border: 1px solid color-mix(in srgb, var(--app-foreground) 10%, transparent); }',
    '.timeline-card__title { font-weight: 700; margin-bottom: 0.8rem; }',
    '.timeline { display: grid; gap: 0.7rem; }',
    '.timeline__item { display: flex; gap: 0.7rem; align-items: flex-start; padding: 0.7rem 0.8rem; border-radius: 0.8rem; transition: all 180ms ease; }',
    '.timeline__item--active { background: color-mix(in srgb, var(--app-accent) 18%, transparent); }',
    '.timeline__item--complete { background: color-mix(in srgb, #16a34a 14%, transparent); }',
    '.timeline__dot { display: inline-flex; align-items: center; justify-content: center; color: var(--app-accent); }',
    '.timeline__label { font-weight: 700; }',
    '.timeline__detail { font-size: 0.84rem; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.console-window { min-height: 220px; display: grid; gap: 0.4rem; padding: 0.75rem; border-radius: 0.8rem; background: #07111f; color: #d7f8ff; font-family: Consolas, monospace; font-size: 0.84rem; overflow: auto; }',
    '.console-window__entry { border-left: 2px solid color-mix(in srgb, var(--app-accent) 50%, transparent); padding-left: 0.55rem; }',
    '.progress-card__actions { display: flex; justify-content: flex-end; gap: 0.75rem; }',
    '@media (max-width: 800px) { .form-grid { grid-template-columns: 1fr; } .scan-card__header { flex-direction: column; align-items: flex-start; } .scan-form__actions { flex-direction: column-reverse; } .scan-form__actions button { width: 100%; } .progress-summary { grid-template-columns: 1fr; } .timeline-grid { grid-template-columns: 1fr; } .progress-card__actions { flex-direction: column-reverse; } .progress-card__actions button { width: 100%; } }'
  ],
  animations: [routeAnimations]
})
export class NewScanComponent implements OnDestroy {
  protected readonly scanForm: FormGroup;
  protected readonly formStatus = signal('Draft');
  protected readonly isScanning = signal(false);
  protected readonly scanProgress = signal(0);
  protected readonly currentPage = signal('https://app.example.com/login');
  protected readonly estimatedTime = signal('00:42');
  protected readonly statusMessage = signal('Launching browser');
  protected readonly timeline = signal<ProgressStep[]>(this.createTimeline());
  protected readonly consoleEntries = signal<string[]>([
    '[INFO] Initializing secure browser session',
    '[INFO] Loading policy profile and session tokens'
  ]);

  private pollingSubscription?: Subscription;
  private scanId = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly scannerService: ScannerService,
    private readonly router: Router
  ) {
    this.scanForm = this.fb.group({
      applicationUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.scanForm.valueChanges.subscribe(() => {
      this.formStatus.set(this.scanForm.valid ? 'Ready to launch' : 'Draft');
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  submitScan(): void {
    if (this.scanForm.invalid) {
      this.scanForm.markAllAsTouched();

      return;
    }

    this.formStatus.set('Starting Scan...');

    const request = {
      url: this.scanForm.value.applicationUrl,

      username: this.scanForm.value.username,

      password: this.scanForm.value.password,

      maxPages: 50
    };

    this.scannerService
      .startScan(request)

      .subscribe({
        next: scan => {
          this.scanId = scan.id;

          this.isScanning.set(true);

          this.consoleEntries.set([
            '[INFO] Scan created successfully',

            `[INFO] Scan Id : ${scan.id}`
          ]);

          this.startPolling();
        },

        error: err => {
          console.error(err);

          this.formStatus.set('Unable to start scan');
        }
      });
  }

  private startPolling() {
    this.pollingSubscription?.unsubscribe();

    this.pollingSubscription = interval(1000)
      .pipe(switchMap(() => this.scannerService.getScan(this.scanId)))

      .subscribe(scan => {
        this.scanProgress.set(scan.progress);

        this.statusMessage.set(scan.currentStep);

        this.timeline.set(this.createTimeline(this.getTimelineIndex(scan.currentStep)));

        this.currentPage.set(scan.currentStep);

        this.consoleEntries.update(entries => [...entries, `[INFO] ${scan.currentStep}`]);

        if (scan.status === 'COMPLETED') {
          this.pollingSubscription?.unsubscribe();

          this.router.navigate(['/scan', 'result', this.scanId]);
        }

        if (scan.status === 'FAILED') {
          this.pollingSubscription?.unsubscribe();

          this.formStatus.set('Scan Failed');
        }
      });
  }

  resetForm(): void {
    this.scanForm.reset({
      applicationUrl: '',
      username: '',
      password: ''
    });
    this.isScanning.set(false);
    this.scanProgress.set(0);
    this.currentPage.set('https://app.example.com/login');
    this.estimatedTime.set('00:42');
    this.statusMessage.set('Launching browser');
    this.timeline.set(this.createTimeline());
    this.consoleEntries.set([
      '[INFO] Initializing secure browser session',
      '[INFO] Loading policy profile and session tokens'
    ]);
    this.formStatus.set('Draft');
  }

  private getTimelineIndex(step: string): number {
    const steps = [
      'Launching Browser',

      'Logging In',

      'Discovering Navigation',

      'Auditing',

      'Checking Cookies',

      'Saving Scan Results',

      'Generating HTML Report',

      'Completed'
    ];

    return Math.max(steps.indexOf(step), 0);
  }

  private createTimeline(activeIndex = 0): ProgressStep[] {
    const steps = [
      {
        label: 'Launching Browser',
        detail: 'Opening a controlled session',
        status: 'pending' as const
      },
      {
        label: 'Logging In',
        detail: 'Authenticating against the target',
        status: 'pending' as const
      },
      {
        label: 'Discovering Navigation',
        detail: 'Mapping navigation and routes',
        status: 'pending' as const
      },
      { label: 'Auditing', detail: 'Inspecting endpoint behavior', status: 'pending' as const },
      { label: 'Checking Cookies', detail: 'Rendering key views', status: 'pending' as const },
      {
        label: 'Saving Scan Results',
        detail: 'Reviewing transport security',
        status: 'pending' as const
      },
      {
        label: 'Generating HTML Report',
        detail: 'Inspecting session handling',
        status: 'pending' as const
      },
      { label: 'Completed', detail: 'Testing input handling paths', status: 'pending' as const }
    ];

    return steps.map((step, index) => {
      if (index < activeIndex) {
        return { ...step, status: 'complete' };
      }
      if (index === activeIndex) {
        return { ...step, status: 'active' };
      }
      return step;
    });
  }
}
