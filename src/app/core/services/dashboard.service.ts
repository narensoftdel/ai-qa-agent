import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DashboardModel } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `http://localhost:3000/api/dashboard`;

  /**
   * GET /api/dashboard — aggregated stats computed by the backend
   */
  getDashboard(): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(this.apiUrl);
  }
}
