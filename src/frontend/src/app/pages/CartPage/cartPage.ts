import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { CartService } from '../../core/services/CartService';
import { CartDto } from '../../core/models/CartDto';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartPage.html',
  styleUrls: ['./cartPage.css'],
})
export class CartPageComponent {

  cart = signal<CartDto | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // demo inputs (like your App dummy data)
  movieId = signal<string>('tt0000001');
  title = signal<string>('Dummy Movie');
  quantity = signal<number>(2);

  constructor(private cartService: CartService) {}

  setMovieId(v: string) { this.movieId.set(v); }
  setTitle(v: string) { this.title.set(v); }
  setQuantity(v: number) { this.quantity.set(v); }

  loadCart() {
    this.cart.set(null);
    this.error.set(null);

    this.isLoading.set(true);
    this.cartService.getCart()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.cart.set(res),
        error: (err) => this.error.set(err?.message ?? 'Cart GET failed'),
      });
  }

  addItem() {
    this.error.set(null);
    this.isLoading.set(true);

    this.cartService.addItem({
      movieId: this.movieId(),
      title: this.title(),
      quantity: this.quantity(),
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (res) => this.cart.set(res),
      error: (err) => this.error.set(err?.message ?? 'Cart ADD failed'),
    });
  }

  updateItem() {
    this.error.set(null);
    this.isLoading.set(true);

    this.cartService.updateItem(this.movieId(), this.quantity())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.cart.set(res),
        error: (err) => this.error.set(err?.message ?? 'Cart UPDATE failed'),
      });
  }

  deleteItem() {
    this.error.set(null);
    this.isLoading.set(true);

    this.cartService.deleteItem(this.movieId())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.cart.set(res),
        error: (err) => this.error.set(err?.message ?? 'Cart DELETE failed'),
      });
  }
}