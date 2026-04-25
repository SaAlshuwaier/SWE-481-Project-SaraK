import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MoviesPageStateDto } from '../../core/models/MoviesPageStateDto';
import { MovieDto } from '../../core/models/MovieDto';
import { MovieService } from '../../core/services/MovieService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-browse-movies',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './browseMovies.component.html',
  styleUrls: ['./browseMovies.component.css']
})
export class BrowseMoviesComponent implements OnInit {
  pageState!: MoviesPageStateDto;

  movies: MovieDto[] = [];
  sortedMovies: MovieDto[] = [];
  contextTitle = '';
  page = 1;
  pageSize: 10 | 20 | 50 | 100 = 20;

  sortBy: 'Title' | 'Rating' = 'Title';
  order: 'asc' | 'desc' = 'asc';

  constructor(
    public route: ActivatedRoute,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
     public router: Router
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe((qp) => {
    this.page = qp['page'] ? Number(qp['page']) : 1;
    this.pageSize = qp['pageSize']
      ? Number(qp['pageSize']) as 10 | 20 | 50 | 100
      : 20;

    this.loadMovies();
  });
}
private updateUrl(): void {
  const genreId = this.route.snapshot.paramMap.get('genreId');
  const letter = this.route.snapshot.queryParams['letter'];
  const genreName = this.route.snapshot.queryParams['genreName'];

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      page: this.page,
      pageSize: this.pageSize,
      letter: letter || null,
      genreName: genreName || null
    },
    queryParamsHandling: 'merge'
  });
}
  private loadMovies(): void {
    const genreId = this.route.snapshot.paramMap.get('genreId');
    const letter = this.route.snapshot.queryParams['letter'];
    const genreName = this.route.snapshot.queryParams['genreName'];

    // Browse by genre
    if (genreId) {
      this.contextTitle = genreName ? `Genre: ${genreName}` : 'Genre Movies';

      this.movieService
        .browseMoviesByGenre(+genreId, this.page, this.pageSize)
        .subscribe({
          next: (state) => this.updateState(state),
          error: (err) => {
            console.error('Error loading movies by genre:', err);
            this.updateState(this.emptyState());
          }
        });

      return;
    }

    // Browse by first letter
    if (letter) {
      this.contextTitle = `Title Starting With: ${letter}`;

      this.movieService
        .browseMoviesByFirstLetter(letter, this.page, this.pageSize)
        .subscribe({
          next: (state) => this.updateState(state),
          error: (err) => {
            console.error('Error loading movies by first letter:', err);
            this.updateState(this.emptyState());
          }
        });

      return;
    }

    // Default browse
    this.contextTitle = 'Browsing';

    this.movieService
      .searchMovies(undefined, undefined, undefined, undefined, this.page, this.pageSize)
      .subscribe({
        next: (state) => this.updateState(state),
        error: (err) => {
          console.error('Error loading default movie list:', err);
          this.updateState(this.emptyState());
        }
      });
  }

private updateState(state: MoviesPageStateDto): void {
  this.pageState = state;
  this.movies = state.movies ?? [];
  this.applySorting();
  this.cdr.detectChanges();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  private emptyState(): MoviesPageStateDto {
    return {
      page: this.page,
      pageSize: this.pageSize,
      totalResults: 0,
      totalPages: 0,
      hasPrev: false,
      hasNext: false,
      movies: []
    };
  }

  onSortChange(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value as 'Title' | 'Rating';
    this.applySorting();
    this.cdr.detectChanges();
  }

  onOrderChange(event: Event): void {
    this.order = (event.target as HTMLSelectElement).value as 'asc' | 'desc';
    this.applySorting();
    this.cdr.detectChanges();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value) as 10 | 20 | 50 | 100;
    this.page = 1;
    this.updateUrl();
  }

nextPage(): void {
  if (this.pageState?.hasNext) {
    this.page++;
    this.updateUrl();
  }
}

previousPage(): void {
  if (this.pageState?.hasPrev) {
    this.page--;
    this.updateUrl();
  }
}

  public applySorting(): void {
    this.sortedMovies = [...this.movies];

    this.sortedMovies.sort((a, b) => {
      let compare = 0;

      if (this.sortBy === 'Title') {
        compare = a.title.localeCompare(b.title);
      } else if (this.sortBy === 'Rating') {
        compare = a.rating - b.rating;
      }

      return this.order === 'asc' ? compare : -compare;
    });
  }
}