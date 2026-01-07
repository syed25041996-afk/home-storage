import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppEvents {
  private refreshDashboardSource = new Subject<void>();

  refreshDashboard$ = this.refreshDashboardSource.asObservable();

  notifyDashboardRefresh() {
    this.refreshDashboardSource.next();
  }
}
