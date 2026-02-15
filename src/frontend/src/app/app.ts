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

import { CheckoutService } from './core/services/CheckoutService';
import { CheckoutDto } from './core/models/CheckoutDto';
import { LoginResponseDto } from './core/models/Auth/LoginResponseDto';
import { LogoutResponseDto } from './core/models/Auth/LogoutResponseDto';
import { LoginRequestDto } from './core/models/Auth/LoginRequestDto';
import { RegisterRequestDto } from './core/models/Auth/RegisterRequestDto';
import { RegisterResponseDto } from './core/models/Auth/RegisterResponseDto';

import {StarService} from './core/services/StarService';
import {StarDto} from './core/models/StarDto';

import {GenreService} from './core/services/GenreService';
import {GenreDto} from './core/models/GenreDto';
import {Observable} from 'rxjs';

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
  movieListResult = signal<MovieDto[] | null>(null);
  movieError = signal<string | null>(null);

  //for states of res
  starResult = signal<StarDto | null>(null);
  starListResult = signal<StarDto[] | null>(null);
  starError = signal<string | null>(null);

  genreResult = signal<GenreDto[] | null>(null);
  genreError = signal<string | null>(null);

  constructor(
    private health: HealthService,
    private cart: CartService,
    private movie: MovieService,
    private auth: AuthService,
    private checkout: CheckoutService,
    private star: StarService,
    private genre: GenreService

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
  // Star dummy data
  private readonly dummyStarId = "nm1636964";

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

  // PATCH /api/cart/updateItem/{movieId}
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
          alert('Successfully reached GET /api/movies');
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
        alert('Successfully reached GET /api/movies/browseByGenre');
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
        alert('Successfully reached GET /api/movies/browseByFirstLetter');
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
        alert('Successfully reached GET /api/movies/{id}');
        this.movieSingleResult.set(res);
      },
      error: (err) =>
        this.movieError.set(err?.message ?? 'Get movie by ID failed'),
    });
  }

  // GET /api/stars/{starId}
  starGet() {
    //Reset States, for a new Req
    this.starResult.set(null);
    this.starError.set(null);

    this.star.getStar(this.dummyStarId).subscribe({
      next: (res) =>{
        alert('Successfully reached Get Star Details endpoint');
        this.starResult.set(res);
      },
      error: (err) => this.starError.set(err?.message ?? 'Get Star Details failed'),
    });
  }

  // GET /api/movies/{movieId}/stars
  starsOfMovieGet() {
    //Reset States, for a new Req
    this.starListResult.set(null);
    this.starError.set(null);

    this.star.getStarsOfMovie(this.dummyMovieId).subscribe({
      next: (res) =>{
        alert('Successfully reached Get Stars of movies endpoint');
        this.starListResult.set(res);},
      error: (err) => this.starError.set(err?.message ?? 'Get Stars of movies failed'),
    });
  }

  // GET /api/stars/${starId}/movies
  moviesOfStarGet() {
    //Reset States, for a new Req
    this.movieListResult.set(null);
    this.movieError.set(null);

    this.star.getMoviesOfStar(this.dummyStarId).subscribe({
      next: (res) => {
        alert('Successfully reached Get movies of stars endpoint');
        this.movieListResult.set(res);},
      error: (err) => this.movieError.set(err?.message ?? 'Get movies of stars failed'),
    });
  }

  // GET /genres
  allGenresGet(){
    this.genreResult.set(null);
    this.genreError.set(null);

    this.genre.getAllGenres().subscribe({
      next:(res)=> {
        alert('Successfully reached Get All Genres endpoint');
        this.genreResult.set(res);},
      error:(err)=> this.genreError.set(err?.message ?? 'Get all Genres failed'),
    });
  }

// ================= AUTH APIs =================

authResult = signal<LoginResponseDto | LogoutResponseDto | RegisterResponseDto | null>(null);
authError = signal<string | null>(null);

private readonly dummyEmail = 'test@uci.edu';
private readonly dummyPassword = 'test123';

authLogin() {
  this.authResult.set(null);
  this.authError.set(null);

  const body: LoginRequestDto = {
    email: this.dummyEmail,
    password: this.dummyPassword,
  };
  
  this.auth.login(body).subscribe({
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
    next: (res: LogoutResponseDto) => {
      alert('Successfully reached POST /api/auth/logout');
      this.authResult.set(res);
    },
    error: (err) =>
      this.authError.set(err?.message ?? 'Auth logout failed'),
  });
}

authRegister() {
  this.authResult.set(null);
  this.authError.set(null);

  const body: RegisterRequestDto = {
    firstName: 'Loba',
    lastName: 'Alyahya',
    email: this.dummyEmail,
    password: this.dummyPassword,
    address: 'Riyadh',
    ccId: '1111222233334444',
  };

  this.auth.register(body).subscribe({
    next: (res: RegisterResponseDto) => {
      alert('Successfully reached POST /api/auth/register');
      this.authResult.set(res);
    },
    error: (err) =>
      this.authError.set(err?.message ?? 'Auth register failed'),
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
