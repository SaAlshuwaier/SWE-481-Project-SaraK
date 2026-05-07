import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';


import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { CheckoutService, CheckoutRequest } from '../../core/services/CheckoutService';
import { CheckoutDto } from '../../core/models/CheckoutDto';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkoutPage.html',
  styleUrls: ['./checkoutPage.css'],
})
export class CheckoutPageComponent {
  firstName = signal<string>('');
  lastName = signal<string>('');
  cardNumber = signal<string>('');
  expiration = signal<string>('');

  firstNameTouched = signal<boolean>(false);
  lastNameTouched = signal<boolean>(false);
  cardNumberTouched = signal<boolean>(false);
  

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<CheckoutDto | null>(null);
  today = new Date().toISOString().split('T')[0];
  //showSuccessToast = signal<boolean>(false);

  //constructor(private checkoutService: CheckoutService) {}
  constructor(
  private checkoutService: CheckoutService,
  private router: Router
) {}

  setFirstName(v: string) { this.firstName.set(v); }
  setLastName(v: string) { this.lastName.set(v); }
  setCardNumber(v: string) { this.cardNumber.set(v); }
  setExpiration(v: string) { this.expiration.set(v); }
  isValidCardName(name: string): boolean {
  return /^[a-zA-Z\s\-]+$/.test(name); }
  isValidCcNumber(cc: string): boolean {
  const stripped = cc.replace(/[\s-]/g, '');
  return /^\d+$/.test(stripped);
}
  


  submit() {
    this.error.set(null);
    this.result.set(null);

    this.firstNameTouched.set(true);
    this.lastNameTouched.set(true);
    this.cardNumberTouched.set(true);

    if (!this.firstName() || !this.lastName() || !this.cardNumber() || !this.expiration()) {
  this.error.set('All fields are required');
  return;
}

if (!this.isValidCardName(this.firstName()) || !this.isValidCardName(this.lastName())) {
  this.error.set('Name on card must contain letters only');
  return;
}


if (!this.isValidCcNumber(this.cardNumber())) {
  this.error.set('Card number must contain digits only');
  return;
}


    const body: CheckoutRequest = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      cardNumber: this.cardNumber(),
      expiration: this.expiration(),
    };

    this.isLoading.set(true);

    this.checkoutService.checkout(body)
  .pipe(finalize(() => this.isLoading.set(false)))
  .subscribe({
    next: (res) => {
  this.result.set(res);

  if (res.success) {
    this.router.navigate(['/checkout-success']);         
    this.firstName.set('');
    this.lastName.set('');
    this.cardNumber.set('');
    this.expiration.set('');
    this.firstNameTouched.set(false);
    this.lastNameTouched.set(false);
    this.cardNumberTouched.set(false);
  }
},
    error: (err) => {
      const backendMessage = err?.error?.message;
      this.error.set(backendMessage || 'Checkout failed');
    },
  });
  }
}