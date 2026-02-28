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

  // Pagination
  page = 1;
  pageSize = 20;

  // Search query (from URL)
  query: { title?: string; year?: string; director?: string; star?: string } = {};

  // Dummy fallback (if service not connected yet)
  private dummyMovies: MovieDto[] = [
    {
      id: 'tt2',
      title: 'Alpha Movie',
      year: 2005,
      director: 'David Clark',
      rating: 8.1,
      genres: [{ id: 2, name: 'Action' }],
      stars: [{ id: 'nm1', name: 'Tom Hardy', birthYear: 1993 }],
    },
    {
      id: 'tt4',
      title: 'Another Tale',
      year: 2022,
      director: 'Aaron Smith',
      rating: 7.9,
      genres: [{ id: 1, name: 'Drama' }],
      stars: [{ id: 'nm4', name: 'Brad Pitt', birthYear: 1963 }],
    },
  ];

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

  // ===== Load results =====
private loadSearchResults(): void {
  const yearNumber =
    this.query.year && this.query.year.trim() !== ''
      ? Number(this.query.year)
      : undefined;

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
      },
      error: () => {
        const filtered = this.filterDummyMovies();
        this.pageState = {
          page: 1,
          pageSize: this.pageSize,
          totalResults: filtered.length,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
          movies: filtered,
        } as any;
        this.movies = filtered;
      },
    });
}

  // ===== Dummy filter (fallback only) =====
  private filterDummyMovies(): MovieDto[] {
    const title = (this.query.title || '').toLowerCase();
    const director = (this.query.director || '').toLowerCase();
    const year = (this.query.year || '').trim();
    const star = (this.query.star || '').toLowerCase();

    return this.dummyMovies.filter((m) => {
      const okTitle = !title || m.title.toLowerCase().includes(title);
      const okDirector = !director || m.director.toLowerCase().includes(director);
      const okYear = !year || String(m.year) === year;
      const okStar =
        !star ||
        (m.stars ?? []).some((s) => s.name.toLowerCase().includes(star));

      return okTitle && okDirector && okYear && okStar;
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