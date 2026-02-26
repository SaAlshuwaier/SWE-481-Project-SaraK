import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { MovieService } from '../core/services/MovieService';
import { CartService } from '../core/services/CartService';

import { MovieDto } from '../core/models/MovieDto';
import { CartDto } from '../core/models/CartDto';
/**
 * MovieDetailsPage
 *
 * Responsibilities:
 * 1) Read movieId from the URL (route param).
 * 2) Call MovieService.getMovieById(movieId) to fetch the movie details.
 * 3) Display movie info (title, year, director, rating, genres).
 * 4) Display list of stars as clickable links to Star Details page.
 * 5) Provide "Add to Cart" UI with quantity controls and call CartService.addItem(...).
 */
@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movieDetailsPage.html',
  styleUrls: ['./movieDetailsPage.css'],
})

export class MovieDetailsPageComponent implements OnDestroy {
 private readonly MOCK_MOVIE: MovieDto = {
    id: 'tt0413051',
    title: 'No Longer My Twin',
    year: 2002,
    director: 'Robert G. Christie',
    rating: 1.4,
    genres: [{ id: 16, name: 'Mystery' }],
    stars: [
      { id: 'nm1636964', name: 'Phantom Artsy', birthYear: 1970 },
      { id: 'nm1382753', name: 'Maria Angelucci', birthYear: 1975 },
    ],
  };
  movie = signal<MovieDto | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  quantity = signal<number>(1);
  cartResult = signal<CartDto | null>(null);
  cartError = signal<string | null>(null);

  // Keep a reference so we can unsubscribe on destroy
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {    // Reactive subscription:
    //DELETE THIS, REMOVE COMMENT, AND IMPLEMENT LATER WHEN WE CONNECT TO THE DATABASE. THIS IS ONLY FOR DEMO PURPOSES UNTIL THEN.
    this.movie.set(this.MOCK_MOVIE);
    this.isLoading.set(false);
    // - Runs once immediately
    // - Runs again whenever :movieId changes while component stays alive
    // this.sub.add(
    //   this.route.paramMap.subscribe((params) => {
    //     const movieId = params.get('movieId');

    //     if (!movieId) {
    //       this.movie.set(null);
    //       this.isLoading.set(false);
    //       this.error.set('Missing movieId in route.');
    //       return;
    //     }

    //     // Load movie details from backend whenever movieId changes
    //     this.loadMovie(movieId);

    //     // Reset quantity when switching to another movie
    //     this.quantity.set(1);
    //   })
    // );
  }

  /**
   * Loads the movie by id from backend using MovieService.getMovieById.
   * This is separated from routing so it can be called multiple times cleanly.
   */
private loadMovie(movieId: string): void {
  this.isLoading.set(true);
  this.error.set(null);
  this.movie.set(null);

 this.movieService
      .getMovieById(movieId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          // res is MovieDto returned by the backend
          this.movie.set(res);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Failed to load movie details.');
        },
      });
  }



  /** Decrease quantity but never below 1. */
  decQty(): void {
    const q = this.quantity();
    if (q > 1) this.quantity.set(q - 1);
  }

  /** Increase quantity by 1. */
  incQty(): void {
    this.quantity.set(this.quantity() + 1);
  }

  /**
   * Validates manual input (user typing).
   * - Must be a finite number
   * - Must be >= 1
   */
  onQtyInput(value: string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) {
      this.quantity.set(1);
      return;
    }
    this.quantity.set(Math.floor(parsed));
  }

  /**
   * Adds the current movie with selected quantity to cart.
   * Uses your CartService.addItem({ movieId, title, quantity }).
   */
  addToCart(): void {
    const m = this.movie();
    if (!m) return; // nothing loaded -> nothing to add

    this.cartResult.set(null);
    this.cartError.set(null);

    this.cartService
      .addItem({
        movieId: m.id,
        title: m.title,
        quantity: this.quantity(),
      })
      .subscribe({
        next: (res) => {
          alert('Added to cart!');
          this.cartResult.set(res);
        },
        error: (err) => {
          this.cartError.set(err?.message ?? 'Add to cart failed.');
        },
      });
  }

  /**
   * Display rating like "4.2/10"
   */
  formatRating(rating: number | null | undefined): string {
    if (rating === null || rating === undefined) return '-';
    return `${rating}/10`;
  }

  /**
   * IMPORTANT:
   * Because we manually subscribe to paramMap, we must unsubscribe
   * when the component is destroyed to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
