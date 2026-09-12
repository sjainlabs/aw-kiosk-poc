import { Injectable } from '@angular/core';
import { HealthService } from './health.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppStatusService {
  backendHealthy$ = new BehaviorSubject<boolean>(false);

  constructor(private health: HealthService) {
    this.startHealthPolling();
  }

  private startHealthPolling() {
    setInterval(() => {
      this.health.checkHealth().subscribe(ok => {
        this.backendHealthy$.next(ok);
      });
    }, 5000);
  }
}
