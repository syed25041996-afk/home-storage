import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SuccessModalService {
  show = signal(false);
  title = signal('');
  message = signal('');

  showSuccess(title: string, message: string) {
    this.title.set(title);
    this.message.set(message);
    this.show.set(true);
  }

  close() {
    this.show.set(false);
  }
}