import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { routeAnimations } from '../../shared/animations/route-animations';

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
    MatSlideToggleModule
  ],
  template: `
    <div @routeAnimation class="page-shell">
      <mat-card class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-card__eyebrow">Workspace controls</p>
            <h2>Enterprise Settings</h2>
            <p class="settings-card__subtitle">
              Tune the platform for your security operations team.
            </p>
          </div>
          <div class="settings-card__badge">
            <mat-icon>shield</mat-icon>
            <span>Secure defaults</span>
          </div>
        </div>

        <div class="settings-grid">
          <mat-card class="panel-card">
            <div class="panel-card__title">Preferences</div>
            <div class="field-grid">
              <mat-form-field appearance="outline">
                <mat-label>Theme</mat-label>
                <mat-select [(ngModel)]="theme">
                  <mat-option value="Dark">Dark</mat-option>
                  <mat-option value="Light">Light</mat-option>
                  <mat-option value="System">System</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Language</mat-label>
                <mat-select [(ngModel)]="language">
                  <mat-option value="English">English</mat-option>
                  <mat-option value="German">German</mat-option>
                  <mat-option value="French">French</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Default Browser</mat-label>
                <mat-select [(ngModel)]="defaultBrowser">
                  <mat-option value="Chrome">Chrome</mat-option>
                  <mat-option value="Edge">Edge</mat-option>
                  <mat-option value="Firefox">Firefox</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>AI Provider</mat-label>
                <mat-select [(ngModel)]="aiProvider">
                  <mat-option value="OpenAI">OpenAI</mat-option>
                  <mat-option value="Azure OpenAI">Azure OpenAI</mat-option>
                  <mat-option value="Anthropic">Anthropic</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card>

          <mat-card class="panel-card">
            <div class="panel-card__title">Integration & automation</div>
            <div class="field-grid">
              <mat-form-field appearance="outline">
                <mat-label>OpenAI API Key</mat-label>
                <input matInput [(ngModel)]="apiKey" type="password" placeholder="••••••••" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Concurrent Scans</mat-label>
                <input matInput [(ngModel)]="concurrentScans" type="number" min="1" max="20" />
              </mat-form-field>
            </div>

            <div class="toggle-list">
              <mat-slide-toggle [(ngModel)]="emailNotifications"
                >Email notifications</mat-slide-toggle
              >
              <mat-slide-toggle [(ngModel)]="desktopNotifications"
                >Desktop notifications</mat-slide-toggle
              >
              <mat-slide-toggle [(ngModel)]="autoReportDelivery"
                >Auto report delivery</mat-slide-toggle
              >
            </div>
          </mat-card>
        </div>

        <div class="settings-actions">
          <button mat-stroked-button type="button">Reset</button>
          <button mat-flat-button color="primary" type="button">Save</button>
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
    '.settings-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; padding: 0.6rem 1.2rem 1rem; }',
    '.panel-card { border-radius: 1rem; padding: 1rem; background: color-mix(in srgb, var(--app-surface-muted) 90%, transparent); }',
    '.panel-card__title { font-weight: 700; margin-bottom: 0.8rem; }',
    '.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; }',
    '.toggle-list { display: grid; gap: 0.6rem; margin-top: 0.8rem; }',
    '.settings-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 0 1.2rem 1.2rem; }',
    '@media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }',
    '@media (max-width: 600px) { .settings-card__header { flex-direction: column; align-items: flex-start; } .field-grid { grid-template-columns: 1fr; } .settings-actions { flex-direction: column-reverse; } .settings-actions button { width: 100%; } }'
  ],
  animations: [routeAnimations]
})
export class SettingsComponent {
  protected theme = 'Dark';
  protected language = 'English';
  protected defaultBrowser = 'Chrome';
  protected aiProvider = 'OpenAI';
  protected apiKey = '';
  protected concurrentScans = 4;
  protected emailNotifications = true;
  protected desktopNotifications = true;
  protected autoReportDelivery = false;
}
