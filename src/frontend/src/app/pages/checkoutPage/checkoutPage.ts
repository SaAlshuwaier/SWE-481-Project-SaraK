import { Component, signal } from '@angular/core';
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

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<CheckoutDto | null>(null);

  constructor(private checkoutService: CheckoutService) {}

  setFirstName(v: string) { this.firstName.set(v); }
  setLastName(v: string) { this.lastName.set(v); }
  setCardNumber(v: string) { this.cardNumber.set(v); }
  setExpiration(v: string) { this.expiration.set(v); }

  submit() {
    this.error.set(null);
    this.result.set(null);

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
    next: (res) => this.result.set(res),
    error: (err) => {
      const backendMessage = err?.error?.message;
      this.error.set(backendMessage || 'Checkout failed');
    },
  });
  }
}