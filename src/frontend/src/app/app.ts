import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { HealthService } from './core/services/health';
import { HealthResponse } from './core/models/HealthDto';

import { CartService } from './core/services/CartService';
import { CartDto } from './core/models/CartDto';

import { MovieService } from './core/services/MovieService';
import { MoviesPageStateDto } from './core/models/MoviesPageStateDto';
import { MovieDto } from './core/models/MovieDto';

import { AuthService } from './core/services/AuthService';
import { AuthDto } from './core/models/AuthDto';

import { CheckoutService } from './core/services/CheckoutService';
import { CheckoutDto } from './core/models/CheckoutDto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    JsonPipe
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');

  result = signal<HealthResponse | null>(null);
  error = signal<string | null>(null);

  // Cart output (separate)
  cartResult = signal<CartDto | null>(null);
  cartError = signal<string | null>(null);


  movieResult = signal<MoviesPageStateDto | null>(null);
  movieSingleResult = signal<MovieDto | null>(null);
  movieError = signal<string | null>(null);

  constructor(
    private health: HealthService,
    private cart: CartService,
    private movie: MovieService,
    private auth: AuthService,
    private checkout: CheckoutService

  ) { }

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



  // Movie dummy data 
  private readonly dummySearchTitle = 'bat';
  private readonly dummyGenreId = 1;
  private readonly dummyFirstLetter = 'A';
  private readonly dummyMovieForDetails = 'tt0000001';

  // GET /api/cart
  cartGet() {
    this.cartResult.set(null);
    this.cartError.set(null);

    //here the getCart is the one inside the service
    this.cart.getCart().subscribe({ //since it returns Observable then we add subscribe 
      next: (res) => {
        alert('Successfully reached GET /api/cart');
        this.cartResult.set(res);
      },
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
      next: (res) => {
        alert('Successfully reached POST /api/cart/addItem');
        this.cartResult.set(res);
      },
      error: (err) => this.cartError.set(err?.message ?? 'Cart ADD failed'),
    });
  }

  // POST /api/cart/updateItem/{movieId}
  cartUpdate() {
    this.cartResult.set(null);
    this.cartError.set(null);

    // update the dummyMovieId to a new quantity (example: 5)
    this.cart.updateItem(this.dummyMovieId, 5).subscribe({
      next: (res) => {
        alert('Successfully reached POST /api/cart/updateItem/{movieId}');
        this.cartResult.set(res);
      },
      error: (err) => this.cartError.set(err?.message ?? 'Cart UPDATE failed'),
    });
  }

  // DELETE /api/cart/deleteItem/{movieId}
  cartDelete() {
    this.cartResult.set(null);
    this.cartError.set(null);

    this.cart.deleteItem(this.dummyMovieId).subscribe({
      next: (res) => {
        alert('Successfully reached DELETE /api/cart/deleteItem/{movieId}');
        this.cartResult.set(res)
      },
      error: (err) => this.cartError.set(err?.message ?? 'Cart DELETE failed'),
    });
  }


  movieSearch() {
    this.movieResult.set(null);
    this.movieError.set(null);

    this.movie.searchMovies(
      this.dummySearchTitle,
      undefined,
      undefined,
      undefined,
      1,
      10
    )
      .subscribe({
        next: (res) => {
          alert('Successfully reached SEARCH movies endpoint');
          this.movieResult.set(res);
        },
        error: (err) => this.movieError.set(err?.message ?? 'Movie SEARCH failed'),
      });

  }

  movieBrowseGenre() {
    this.movieResult.set(null);
    this.movieError.set(null);

    this.movie.browseMoviesByGenre(
      this.dummyGenreId,
      1,
      10
    ).subscribe({
      next: (res) => {
        alert('Successfully reached BROWSE BY GENRE endpoint');
        this.movieResult.set(res);
      },
      error: (err) =>
        this.movieError.set(err?.message ?? 'Browse by genre failed'),
    });
  }


  movieBrowseFirstLetter() {
    this.movieResult.set(null);
    this.movieError.set(null);

    this.movie.browseMoviesByFirstLetter(
      this.dummyFirstLetter,
      1,
      10
    ).subscribe({
      next: (res) => {
        alert('Successfully reached BROWSE BY FIRST LETTER endpoint');
        this.movieResult.set(res);
      },
      error: (err) =>
        this.movieError.set(err?.message ?? 'Browse by first letter failed'),
    });
  }

  movieGetById() {
    this.movieSingleResult.set(null);
    this.movieError.set(null);

    this.movie.getMovieById(
      this.dummyMovieForDetails
    ).subscribe({
      next: (res) => {
        alert('Successfully reached GET MOVIE BY ID endpoint');
        this.movieSingleResult.set(res);
      },
      error: (err) =>
        this.movieError.set(err?.message ?? 'Get movie by ID failed'),
    });
  }
// ================= AUTH APIs =================

authResult = signal<AuthDto | null>(null);
authError = signal<string | null>(null);

private readonly dummyEmail = 'test@uci.edu';
private readonly dummyPassword = 'test123';

authLogin() {
  this.authResult.set(null);
  this.authError.set(null);

  this.auth.login({
    email: this.dummyEmail,
    password: this.dummyPassword
  }).subscribe({
    next: (res) => {
      alert('Successfully reached POST /api/auth/login');
      this.authResult.set(res);
    },
    error: (err) =>
      this.authError.set(err?.message ?? 'Auth login failed'),
  });
}

authLogout() {
  this.authResult.set(null);
  this.authError.set(null);

  this.auth.logout().subscribe({
    next: (res) => {
      alert('Successfully reached POST /api/auth/logout');
      this.authResult.set(res);
    },
    error: (err) =>
      this.authError.set(err?.message ?? 'Auth logout failed'),
  });
}
// ================= CHECKOUT APIs =================

checkoutResult = signal<CheckoutDto | null>(null);
checkoutError = signal<string | null>(null);

// Dummy data (Phase 2)
private readonly dummyFirstName = 'Jana';
private readonly dummyLastName = 'Alshreef';
private readonly dummyCardNumber = '1211111111111111';
private readonly dummyExpiration = '2030-12-31';

doCheckout() {
  this.checkoutResult.set(null);
  this.checkoutError.set(null);

  this.checkout.checkout({
    firstName: this.dummyFirstName,
    lastName: this.dummyLastName,
    cardNumber: this.dummyCardNumber,
    expiration: this.dummyExpiration,
  }).subscribe({
    next: (res) => {
      alert('Successfully reached POST /api/checkout');
      this.checkoutResult.set(res);
    },
    error: (err) =>
      this.checkoutError.set(err?.message ?? 'Checkout failed'),
  });
}





}
