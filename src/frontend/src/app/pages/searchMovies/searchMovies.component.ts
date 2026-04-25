import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { MovieService } from '../../core/services/MovieService';
import { MoviesPageStateDto } from '../../core/models/MoviesPageStateDto';
import { MovieDto } from '../../core/models/MovieDto';

@Component({
  selector: 'app-search-movies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './searchMovies.component.html',
  styleUrls: ['./searchMovies.component.css'],
})
export class SearchMoviesComponent implements OnInit {
  pageState = signal<MoviesPageStateDto | null>(null);
  movies = signal<MovieDto[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  page = 1;
  pageSize = 20;

  query: { title?: string; year?: string; director?: string; star?: string } = {};

  constructor(
    private route: ActivatedRoute,
    public  router: Router,
    private movieService: MovieService
  ) {}

ngOnInit(): void {
  this.route.queryParams.subscribe((qp) => {
    this.query = {
      title: qp['title'] || undefined,
      year: qp['year'] || undefined,
      director: qp['director'] || undefined,
      star: qp['star'] || undefined,
    };
    this.page = qp['page'] ? Number(qp['page']) : 1;
    this.loadSearchResults();
  });
}
private updateUrl(): void {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      title: this.query.title || null,
      year: this.query.year || null,
      director: this.query.director || null,
      star: this.query.star || null,
      page: this.page
    },
    queryParamsHandling: 'merge'
  });
}
private loadSearchResults(): void {
  const rawYear = this.query.year?.trim();
  let yearNumber: number | undefined = undefined;

  // Frontend validation before sending request
  if (rawYear) {
    const parsed = Number(rawYear);
const currentYear = new Date().getFullYear();
    if (!Number.isInteger(parsed) ||
  parsed < 1800 ||
  parsed > currentYear) {
      this.movies.set([]);
      this.pageState.set({
        page: this.page,
        pageSize: this.pageSize,
        totalResults: 0,
        totalPages: 0,
        hasPrev: false,
        hasNext: false,
        movies: [],
      });
      this.errorMessage.set('Year must be a valid number.');
      this.loading.set(false);
      return;
    }

    yearNumber = parsed;
  }

  this.loading.set(true);
  this.errorMessage.set('');

  this.movieService
    .searchMovies(
      this.query.title,
      yearNumber,
      this.query.director,
      this.query.star,
      this.page,
      this.pageSize
    )
    .pipe(
      take(1),
      finalize(() => {
        this.loading.set(false);
      })
    )
  .subscribe({
  next: (state) => {
    this.pageState.set(state);
    this.movies.set(state.movies ?? []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
      error: (err) => {
        console.error('SEARCH ERROR:', err);
        this.movies.set([]);
        this.pageState.set({
          page: this.page,
          pageSize: this.pageSize,
          totalResults: 0,
          totalPages: 0,
          hasPrev: false,
          hasNext: false,
          movies: [],
        });
        this.errorMessage.set('Something went wrong while loading results.');
      },
    });
}


  nextPage(): void {
  if (this.pageState()?.hasNext) {
    this.page++;
    this.updateUrl();
  }
}

previousPage(): void {
  if (this.pageState()?.hasPrev) {
    this.page--;
    this.updateUrl();
  }
}

  backToHome(): void {
    this.router.navigate(['/home']);
  }
}