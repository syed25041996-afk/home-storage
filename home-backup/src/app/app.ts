import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalService } from './shared/error-modal.service';
import { SuccessModalService } from './shared/success-modal.service';
import { LoadingService } from './shared/loading.service';
import { ErrorModalComponent } from './components/error-modal/error-modal';
import { SuccessModalComponent } from './components/success-modal/success-modal';
import { LoaderComponent } from './components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModalComponent, SuccessModalComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  errorModalService = inject(ErrorModalService);
  successModalService = inject(SuccessModalService);
  loadingService = inject(LoadingService);
}
