import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  CheckDefinition,
  SecuritySettings,
  SecuritySettingsResponse
} from '../models/security-check.model';

@Injectable({ providedIn: 'root' })
export class SecurityChecksService {
  private readonly http = inject(HttpClient);

  private readonly api = 'http://localhost:3000/api/settings';

  readonly catalog = signal<CheckDefinition[]>([]);

  readonly settings = signal<SecuritySettings>({ enabledChecks: [], aiEnabled: true });

  readonly loading = signal(false);

  readonly saving = signal(false);

  /**
   * GET /api/settings — catalog of all checks + current enabled state.
   */
  load(): Observable<SecuritySettingsResponse> {
    this.loading.set(true);

    return this.http.get<SecuritySettingsResponse>(this.api).pipe(
      tap(response => {
        this.catalog.set(response.catalog);
        this.settings.set(response.settings);
        this.loading.set(false);
      })
    );
  }

  /**
   * PUT /api/settings — persist enabled checks + AI toggle.
   */
  save(settings: SecuritySettings): Observable<SecuritySettingsResponse> {
    this.saving.set(true);

    return this.http.put<SecuritySettingsResponse>(this.api, settings).pipe(
      tap(response => {
        this.catalog.set(response.catalog);
        this.settings.set(response.settings);
        this.saving.set(false);
      })
    );
  }
}
