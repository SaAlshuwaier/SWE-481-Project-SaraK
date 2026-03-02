import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/AuthService';
import { RegisterRequestDto } from '../../core/models/Auth/RegisterRequestDto';
import { RegisterResponseDto } from '../../core/models/Auth/RegisterResponseDto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registerPage.html',
  styleUrls: ['./registerPage.css'],
})
export class RegisterPageComponent {

  firstName = signal<string>('');
  lastName = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  address = signal<string>('');
  ccId = signal<string>('');

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<RegisterResponseDto | null>(null);

  constructor(private auth: AuthService) {}

  setFirstName(v: string) { this.firstName.set(v); }
  setLastName(v: string) { this.lastName.set(v); }
  setEmail(v: string) { this.email.set(v); }
  setPassword(v: string) { this.password.set(v); }
  setAddress(v: string) { this.address.set(v); }
  setCcId(v: string) { this.ccId.set(v); }

  submit() {
    this.result.set(null);
    this.error.set(null);

    const body: RegisterRequestDto = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
      address: this.address(),
      ccId: this.ccId(),
    };

    this.isLoading.set(true);

    this.auth.register(body)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.result.set(res),
        error: (err) => this.error.set(err?.message ?? 'Register failed'),
      });
  }
}