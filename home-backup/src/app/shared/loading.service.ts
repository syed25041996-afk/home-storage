import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private count = signal(0);
  isLoading = computed(() => this.count() > 0);

  start() {
    this.count.update(c => c + 1);
  }

  stop() {
    this.count.update(c => Math.max(0, c - 1));
  }
}