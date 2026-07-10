import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { routeAnimations } from '../../shared/animations/route-animations';

@Component({
  selector: 'app-page-details',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatTabsModule],
  template: `
    <div @routeAnimation class="page-shell">
      <mat-card class="details-card">
        <div class="details-card__header">
          <div>
            <p class="details-card__eyebrow">Page analysis</p>
            <h2>Login Workflow</h2>
            <p class="details-card__subtitle">
              Deep inspection of the authentication flow and its browser-facing security posture.
            </p>
          </div>
          <button mat-flat-button color="primary" type="button">
            <mat-icon>share</mat-icon>
            Share Report
          </button>
        </div>

        <div class="hero-grid">
          <div class="preview-card">
            <div class="preview-card__frame">
              <div class="preview-card__browser-bar"><span></span><span></span><span></span></div>
              <div class="preview-card__content">
                <h3>Secure Sign In</h3>
                <div class="preview-card__field"></div>
                <div class="preview-card__field"></div>
                <div class="preview-card__field preview-card__field--short"></div>
              </div>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-card">
              <span class="meta-card__label">URL</span>
              <strong>https://app.example.com/login</strong>
            </div>
            <div class="meta-card">
              <span class="meta-card__label">Page Title</span>
              <strong>Secure Sign In • Finance Portal</strong>
            </div>
            <div class="meta-card">
              <span class="meta-card__label">Forms</span>
              <strong>2</strong>
            </div>
            <div class="meta-card">
              <span class="meta-card__label">Buttons</span>
              <strong>4</strong>
            </div>
            <div class="meta-card">
              <span class="meta-card__label">Links</span>
              <strong>6</strong>
            </div>
            <div class="meta-card">
              <span class="meta-card__label">Cookies</span>
              <strong>3 observed</strong>
            </div>
          </div>
        </div>

        <mat-tab-group class="detail-tabs">
          <mat-tab label="Overview">
            <div class="tab-content">
              <div class="overview-grid">
                <div class="panel-card">
                  <div class="panel-card__title">Headers</div>
                  <div class="stack-list">
                    <div class="stack-list__item">
                      <strong>Strict-Transport-Security:</strong> missing
                    </div>
                    <div class="stack-list__item">
                      <strong>Content-Security-Policy:</strong> partially enforced
                    </div>
                    <div class="stack-list__item"><strong>X-Frame-Options:</strong> DENY</div>
                  </div>
                </div>
                <div class="panel-card">
                  <div class="panel-card__title">Console</div>
                  <div class="stack-list">
                    <div class="stack-list__item">[warning] XHR request returned 401</div>
                    <div class="stack-list__item">[error] Uncaught TypeError in form handler</div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="API Requests">
            <div class="tab-content">
              <div class="stack-list">
                <div class="stack-list__item">
                  <strong>POST /api/auth/login</strong> • 302 redirect • 2.1s
                </div>
                <div class="stack-list__item">
                  <strong>GET /api/session</strong> • 200 OK • 280ms
                </div>
                <div class="stack-list__item">
                  <strong>GET /api/profile</strong> • 200 OK • 450ms
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="AI Summary">
            <div class="tab-content">
              <div class="panel-card panel-card--highlight">
                <div class="panel-card__title">Signal Summary</div>
                <p>
                  The authentication page shows a moderate escalation risk due to weak session
                  handling, missing HSTS enforcement, and a client-side error path that could weaken
                  trust boundaries.
                </p>
                <div class="chip-row">
                  <mat-chip>Session hardening</mat-chip>
                  <mat-chip>Header policy</mat-chip>
                  <mat-chip>Form resilience</mat-chip>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Recommendations">
            <div class="tab-content">
              <div class="stack-list">
                <div class="stack-list__item">
                  <strong>Rotate exposed tokens</strong> • invalidate and rotate all client-side
                  tokens immediately.
                </div>
                <div class="stack-list__item">
                  <strong>Introduce HSTS preload</strong> • enforce HTTPS-only transport for the
                  full domain.
                </div>
                <div class="stack-list__item">
                  <strong>Harden form handling</strong> • sanitize inputs and add client-side
                  validation hooks.
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [
    '.page-shell { display: grid; }',
    '.details-card { border-radius: 1.35rem; padding: 0.2rem 0 0.4rem; box-shadow: var(--app-shadow); background: var(--app-surface); }',
    '.details-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.1rem 1.2rem 0.5rem; }',
    '.details-card__eyebrow { margin: 0 0 0.2rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--app-accent); font-weight: 700; }',
    '.details-card__header h2 { margin: 0; font-size: 1.28rem; }',
    '.details-card__subtitle { margin: 0.2rem 0 0; color: color-mix(in srgb, var(--app-foreground) 70%, transparent); }',
    '.hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1rem; padding: 0.6rem 1.2rem 1rem; }',
    '.preview-card, .meta-card, .panel-card { border-radius: 1rem; background: color-mix(in srgb, var(--app-surface-muted) 92%, transparent); border: 1px solid color-mix(in srgb, var(--app-foreground) 8%, transparent); }',
    '.preview-card { padding: 0.9rem; }',
    '.preview-card__frame { border-radius: 0.95rem; overflow: hidden; border: 1px solid color-mix(in srgb, var(--app-foreground) 10%, transparent); background: #0f172a; }',
    '.preview-card__browser-bar { display: flex; gap: 0.35rem; padding: 0.65rem 0.8rem; background: #111827; }',
    '.preview-card__browser-bar span { width: 0.6rem; height: 0.6rem; border-radius: 999px; background: #475569; display: inline-block; }',
    '.preview-card__content { padding: 1rem; color: #e2e8f0; display: grid; gap: 0.7rem; }',
    '.preview-card__content h3 { margin: 0; font-size: 1rem; }',
    '.preview-card__field { height: 0.9rem; width: 100%; border-radius: 999px; background: color-mix(in srgb, var(--app-accent) 26%, transparent); }',
    '.preview-card__field--short { width: 60%; }',
    '.meta-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; }',
    '.meta-card { padding: 0.9rem; display: grid; gap: 0.25rem; }',
    '.meta-card__label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: color-mix(in srgb, var(--app-foreground) 65%, transparent); }',
    '.detail-tabs { padding: 0 1.2rem 1.2rem; }',
    '.tab-content { padding-top: 1rem; }',
    '.overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }',
    '.panel-card { padding: 1rem; }',
    '.panel-card--highlight { background: linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 18%, transparent), color-mix(in srgb, #0f172a 10%, transparent)); }',
    '.panel-card__title { font-weight: 700; margin-bottom: 0.6rem; }',
    '.stack-list { display: grid; gap: 0.6rem; }',
    '.stack-list__item { padding: 0.7rem 0.8rem; border-radius: 0.8rem; background: color-mix(in srgb, var(--app-surface) 90%, transparent); }',
    '.chip-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem; }',
    '@media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } .overview-grid { grid-template-columns: 1fr; } }',
    '@media (max-width: 600px) { .details-card__header { flex-direction: column; align-items: flex-start; } .meta-grid { grid-template-columns: 1fr; } }'
  ],
  animations: [routeAnimations]
})
export class PageDetailsComponent {}
