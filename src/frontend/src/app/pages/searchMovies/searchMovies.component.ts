import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  // ===== Page state =====
  pageState!: MoviesPageStateDto;

  // Movies returned from backend (or dummy if service not ready)
  movies: MovieDto[] = [];
  
  loading = false;
  errorMessage = '';


  // Pagination
  page = 1;
  pageSize = 20;

  // Search query (from URL)
  query: { title?: string; year?: string; director?: string; star?: string } = {};



  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    // Listen to query params and reload results
    this.route.queryParams.subscribe((qp) => {
      this.page = 1;

      this.query = {
        title: qp['title'] || undefined,
        year: qp['year'] || undefined,
        director: qp['director'] || undefined,
        star: qp['star'] || undefined,
      };

      this.loadSearchResults();
    });
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
    .subscribe({
      next: (state) => {
        this.pageState = state;
        this.movies = state.movies ?? [];
        this.loading = false;
      },
      error: () => {
        // On error, clear movies and pageState but show error message
        this.movies = [];
        this.pageState = {
          page: this.page,
          pageSize: this.pageSize,
          totalResults: 0,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
          movies: [],
        } as any;

        this.errorMessage = 'Something went wrong while loading results.';
        this.loading = false;
      },
    });
}

  

  // ===== Pagination =====
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

  // ===== Back to home =====
  backToHome(): void {
    this.router.navigate(['/home']);
  }
}