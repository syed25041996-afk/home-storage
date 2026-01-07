import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorModalService } from '../../shared/error-modal.service';
import { SuccessModalService } from '../../shared/success-modal.service';
import { LoadingService } from '../../shared/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = signal('');
  password = signal('');

  constructor(private router: Router, private http: HttpClient, private errorModalService: ErrorModalService, private successModalService: SuccessModalService, private loadingService: LoadingService) {}

  onSubmit() {
    if (this.username() && this.password()) {
      this.loadingService.start();
      this.http.post(`${environment.apiUrl}/auth/login`, {
        username: this.username(),
        password: this.password()
      }).pipe(
        finalize(() => {
          this.loadingService.stop();
        })
      ).subscribe({
        next: (response: any) => {
          // Store user info and credentials for Basic auth
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('credentials', btoa(`${this.username()}:${this.password()}`));
          this.successModalService.showSuccess('Login Successful', 'Welcome back!');
          // Navigate after showing success
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorModalService.showError('Login Failed', 'Invalid username or password. Please try again.');
        },
        complete: () => {
          this.loadingService.stop();
        }
      });
    }
  }
}
