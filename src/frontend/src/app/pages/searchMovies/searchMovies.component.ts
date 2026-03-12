import { Component, OnInit } from '@angular/core';
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
  pageState: MoviesPageStateDto | null = null;
  movies: MovieDto[] = [];

  loading = false;
  errorMessage = '';

  page = 1;
  pageSize = 20;

  query: { title?: string; year?: string; director?: string; star?: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParams;

    this.query = {
      title: qp['title'] || undefined,
      year: qp['year'] || undefined,
      director: qp['director'] || undefined,
      star: qp['star'] || undefined,
    };

    this.loadSearchResults();
  }

  private loadSearchResults(): void {
    const yearNumber =
      this.query.year && this.query.year.trim() !== ''
        ? Number(this.query.year)
        : undefined;

    this.loading = true;
    this.errorMessage = '';

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
          this.loading = false;
        })
      )
      .subscribe({
        next: (state) => {
          this.pageState = state;
          this.movies = state.movies ?? [];
        },
        error: (err) => {
          console.error('SEARCH ERROR:', err);
          this.movies = [];
          this.pageState = {
            page: this.page,
            pageSize: this.pageSize,
            totalResults: 0,
            totalPages: 1,
            hasPrev: false,
            hasNext: false,
            movies: [],
          };
          this.errorMessage = 'Something went wrong while loading results.';
        },
      });
  }

  nextPage(): void {
    if (this.pageState?.hasNext) {
      this.page++;
      this.loadSearchResults();
    }
  }

  previousPage(): void {
    if (this.pageState?.hasPrev) {
      this.page--;
      this.loadSearchResults();
    }
  }

  backToHome(): void {
    this.router.navigate(['/home']);
  }
}