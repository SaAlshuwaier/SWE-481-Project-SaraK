import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { HealthService } from './core/services/health';
import {HealthResponse} from './core/models/HealthDto';

import { CartService } from './core/services/CartService';
import { CartDto } from './core/models/CartDto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    JsonPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  result = signal<HealthResponse | null>(null);
  error = signal<string | null>(null);

  // Cart output (separate)
  cartResult = signal<CartDto | null>(null);
  cartError = signal<string | null>(null);

  constructor(
        private health: HealthService,
        private cart: CartService

  ) {}

  pingBackend() {
    this.result.set(null);
    this.error.set(null);

    this.health.getHealth().subscribe({
      next: (res) => this.result.set(res),
      error: (err) => this.error.set(err?.message ?? 'Request failed'),
    });
  }

  //CART dummy data for connection only
  private readonly dummyMovieId = 'tt0000001';
  private readonly dummyTitle = 'Dummy Movie';
  private readonly dummyQuantity = 2;

  // GET /api/cart
  cartGet() {
    this.cartResult.set(null);
    this.cartError.set(null);

    //here the getCart is the one inside the service
    this.cart.getCart().subscribe({ //since it returns Observable then we add subscribe 
      next: (res) => {alert('Successfully reached GET /api/cart');
                      this.cartResult.set(res);},
      error: (err) => this.cartError.set(err?.message ?? 'Cart GET failed'),
    });
  }

  // POST /api/cart/addItem
  cartAdd() {
    this.cartResult.set(null);
    this.cartError.set(null);

    this.cart.addItem({
      movieId: this.dummyMovieId,
      title: this.dummyTitle,
      quantity: this.dummyQuantity,
    }).subscribe({
      next: (res) => {alert('Successfully reached POST /api/cart/addItem'); 
                        this.cartResult.set(res);},
      error: (err) => this.cartError.set(err?.message ?? 'Cart ADD failed'),
    });
  }

  // POST /api/cart/updateItem/{movieId}
  cartUpdate() {
    this.cartResult.set(null);
    this.cartError.set(null);

    // update the dummyMovieId to a new quantity (example: 5)
    this.cart.updateItem(this.dummyMovieId, 5).subscribe({
      next: (res) => {alert('Successfully reached POST /api/cart/updateItem/{movieId}');
                      this.cartResult.set(res);},
      error: (err) => this.cartError.set(err?.message ?? 'Cart UPDATE failed'),
    });
  }

  // DELETE /api/cart/deleteItem/{movieId}
  cartDelete() {
    this.cartResult.set(null);
    this.cartError.set(null);

    this.cart.deleteItem(this.dummyMovieId).subscribe({
      next: (res) => {alert('Successfully reached DELETE /api/cart/deleteItem/{movieId}');
                      this.cartResult.set(res)},
      error: (err) => this.cartError.set(err?.message ?? 'Cart DELETE failed'),
    });
  }




}
