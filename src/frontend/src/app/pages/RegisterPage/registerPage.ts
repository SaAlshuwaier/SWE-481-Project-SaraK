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
  confirmPassword = signal<string>('');
  address      = signal<string>('');

  emailTouched = signal<boolean>(false);
  ccNumberTouched    = signal<boolean>(false); 
  ccFirstNameTouched = signal<boolean>(false); 
  ccLastNameTouched  = signal<boolean>(false); 
  confirmTouched     = signal<boolean>(false); 

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
  setConfirmPassword(v: string) { this.confirmPassword.set(v); }
  setAddress(v: string) { this.address.set(v); }
  setCcNumber(v: string)     { this.ccNumber.set(v); }
  setCcExpiration(v: string) { this.ccExpiration.set(v); }
  setCcFirstName(v: string)  { this.ccFirstName.set(v); }
  setCcLastName(v: string)   { this.ccLastName.set(v); }

  isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email);
}

isValidCcNumber(cc: string): boolean {
    const stripped = cc.replace(/\s/g, '');
    return /^\d+$/.test(stripped);
  }

  // name on card must contain letters only
  isValidCardName(name: string): boolean {
    return /^[a-zA-Z\s\-]+$/.test(name);
  }

  // passwords must match
    passwordsMatch(): boolean {
    return this.password() === this.confirmPassword();
  }


  submit() {
    this.result.set(null);
    this.error.set(null);

    // trigger all touched flags so inline errors appear on submit
    this.emailTouched.set(true);
    this.ccNumberTouched.set(true);
    this.ccFirstNameTouched.set(true);
    this.ccLastNameTouched.set(true);
    this.confirmTouched.set(true);

    if (!this.firstName() || !this.lastName() || !this.email() ||
        !this.password() || !this.confirmPassword() || 
        !this.address() || !this.ccNumber() || !this.ccExpiration() ||
        !this.ccFirstName() || !this.ccLastName()) {
      this.error.set('All fields are required');
      return;
    }

    if (!this.isValidEmail(this.email())) {
      this.error.set('Invalid email format');
      return;
    }

    if (!this.passwordsMatch()) {
      this.error.set('Passwords do not match');
      return;
    }

    if (!this.isValidCcNumber(this.ccNumber())) {
      this.error.set('Credit card number must contain only digits');
      return;
    }

    if (!this.isValidCardName(this.ccFirstName()) || !this.isValidCardName(this.ccLastName())) {
      this.error.set('Name on card must contain letters only');
      return;
    }

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
      error: (err) => this.error.set(err?.error?.message ?? 'Register failed'),
      });
  }
}