import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/AuthService';
import { LoginRequestDto } from '../../core/models/Auth/LoginRequestDto';
import { LoginResponseDto } from '../../core/models/Auth/LoginResponseDto';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loginPage.html',
  styleUrls: ['./loginPage.css'],
})
export class LoginPageComponent {

  email = signal<string>('');
  password = signal<string>('');
  emailTouched = signal(false);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<LoginResponseDto | null>(null);

  //router needed to navigate locally to home
  constructor(private auth: AuthService, private router: Router) { }

isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email);
}

  onEmailInput(v: string) {
    this.email.set(v);
  }

  onPasswordInput(v: string) {
    this.password.set(v);
  }

  markEmailTouched(): void {
  this.emailTouched.set(true);
}

allowOnlyEnglish(event: KeyboardEvent) {
  const allowedPattern = /^[a-zA-Z0-9@._-]$/;

  const controlKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  if (controlKeys.includes(event.key)) return;

  if (!allowedPattern.test(event.key)) {
    event.preventDefault(); //prevent user to enter it
  }
}

submit() {
  this.result.set(null);
  this.error.set(null);

  const email = this.email();
  const password = this.password();

  if (!this.isValidEmail(email)) {
    this.error.set('Invalid email format');
    return;
  }

  if (!password) {
    this.error.set('Password required');
    return;
  }

  const body: LoginRequestDto = {
    email,
    password
  };

  this.isLoading.set(true);

  this.auth.login(body)
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (res) => {

        if (res.success) {
          this.result.set(res);
          this.router.navigate(['/home']);
        } else {
          this.error.set(res.message);
        }

      },
      error: (err) => {
        const message = err?.error?.message ?? 'Login failed';
        this.error.set(message);
      }
    });
}
}