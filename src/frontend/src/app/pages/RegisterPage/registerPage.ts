import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/AuthService';
import { RegisterRequestDto } from '../../core/models/Auth/RegisterRequestDto';
import { RegisterResponseDto } from '../../core/models/Auth/RegisterResponseDto';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registerPage.html',
  styleUrls: ['./registerPage.css'],
})
export class RegisterPageComponent {

  // Customer fields
  firstName    = signal<string>('');
  lastName     = signal<string>('');
  email        = signal<string>('');
  password     = signal<string>('');
  address      = signal<string>('');

  // Credit card fields
  ccNumber     = signal<string>('');
  ccExpiration = signal<string>('');
  ccFirstName  = signal<string>('');
  ccLastName   = signal<string>('');

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<RegisterResponseDto | null>(null);

  today = new Date().toISOString().split('T')[0]; 
  
  constructor(private auth: AuthService, private router: Router) {}

  setFirstName(v: string) { this.firstName.set(v); }
  setLastName(v: string) { this.lastName.set(v); }
  setEmail(v: string) { this.email.set(v); }
  setPassword(v: string) { this.password.set(v); }
  setAddress(v: string) { this.address.set(v); }
  setCcNumber(v: string)     { this.ccNumber.set(v); }
  setCcExpiration(v: string) { this.ccExpiration.set(v); }
  setCcFirstName(v: string)  { this.ccFirstName.set(v); }
  setCcLastName(v: string)   { this.ccLastName.set(v); }
  emailTouched = signal<boolean>(false);

  isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email);
}

  submit() {
    this.result.set(null);
    this.error.set(null);

    const body: RegisterRequestDto = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
      address: this.address(),
      ccNumber: this.ccNumber(),
      ccExpiration: this.ccExpiration(),
      ccFirstName:  this.ccFirstName(),
      ccLastName:   this.ccLastName(),
    };

    this.isLoading.set(true);

    this.auth.register(body)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/home']);
        } else {
          this.error.set(res.message);
        }
      },   
      error: (err) => this.error.set(err?.message ?? 'Register failed'),
      });
  }
}