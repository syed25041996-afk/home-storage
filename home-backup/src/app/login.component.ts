import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = signal('');
  password = signal('');

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    if (this.username() && this.password()) {
      this.http.post(`${environment.apiUrl}/auth/login`, {
        username: this.username(),
        password: this.password()
      }).subscribe({
        next: (response: any) => {
          // Store user info and credentials for Basic auth
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('credentials', btoa(`${this.username()}:${this.password()}`));
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // In real app, show error message to user
        }
      });
    }
  }
}