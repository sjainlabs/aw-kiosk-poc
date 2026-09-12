import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from '../../environments/environment'
import { catchError, map, timeout, of } from 'rxjs';

export interface HealthResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private healthUrl = `${environment.backendUrl}/health`;

  constructor(private http: HttpClient) {}

  checkHealth() {
    return this.http.get<HealthResponse>(this.healthUrl).pipe(
      timeout(3000),
      map(res => res.status === 'ok'),
      catchError(() => of(false))
    );
  }
}
