import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/AuthService';
import { LoginRequestDto } from '../../core/models/Auth/LoginRequestDto';
import { LoginResponseDto } from '../../core/models/Auth/LoginResponseDto';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loginPage.html',
  styleUrls: ['./loginPage.css'],
})
export class LoginPageComponent {

  email = signal<string>('');
  password = signal<string>('');

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<LoginResponseDto | null>(null);

  constructor(private auth: AuthService) {}

  onEmailInput(v: string) {
    this.email.set(v);
  }

  onPasswordInput(v: string) {
    this.password.set(v);
  }

  submit() {
    this.result.set(null);
    this.error.set(null);

    const body: LoginRequestDto = {
      email: this.email(),
      password: this.password(),
    };

    this.isLoading.set(true);

    this.auth.login(body)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.result.set(res),
        error: (err) => this.error.set(err?.message ?? 'Login failed'),
      });
  }
}
