import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

const DEFAULT_LATENCY_MS = 350;

/** Simulates a successful backend round-trip for mock services. */
export function simulateApiCall<T>(
  value: T,
  latencyMs: number = DEFAULT_LATENCY_MS
): Observable<T> {
  return of(value).pipe(delay(latencyMs));
}

/** Simulates a failed backend round-trip for mock services. */
export function simulateApiFailure<T>(
  message: string,
  latencyMs: number = DEFAULT_LATENCY_MS
): Observable<T> {
  return throwError(() => new Error(message)).pipe(delay(latencyMs));
}
