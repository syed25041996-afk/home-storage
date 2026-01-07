import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorModalService } from '../../shared/error-modal.service';
import { SuccessModalService } from '../../shared/success-modal.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = signal('');
  password = signal('');
  confirmPassword = signal('');

  constructor(private router: Router, private http: HttpClient, private errorModalService: ErrorModalService, private successModalService: SuccessModalService) {}

  onSubmit() {
    if (this.username() && this.password() && this.password() === this.confirmPassword()) {
      this.http.post(`${environment.apiUrl}/auth/register`, {
        username: this.username(),
        password: this.password()
      }).subscribe({
        next: (response: any) => {
          this.successModalService.showSuccess('Registration Successful', 'Your account has been created successfully!');
          // After showing success, navigate to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorModalService.showError('Registration Failed', 'Unable to create account. Please try again.');
        }
      });
    }
  }
}
