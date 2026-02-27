import { Component, OnInit } from '@angular/core';
import {MoviesPageStateDto} from '../../core/models/MoviesPageStateDto';
import {MovieDto} from '../../core/models/MovieDto';
import {MovieService} from '../../core/services/MovieService';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Params, RouterModule} from '@angular/router';

@Component({
  selector: 'app-browse-movies',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './browseMovies.component.html',
  styleUrls: ['./browseMovies.component.css']
})
export class BrowseMoviesComponent implements OnInit {
  pageState!: MoviesPageStateDto;

  // Movies returned from backend (filled with dummy for now)
  movies: MovieDto[] = [];
  // Movies after frontend sorting
  sortedMovies: MovieDto[] = [];
  //for html page title rendering
  contextTitle = '';

  //init
  page = 1;
  pageSize = 20;

  //constants
  sortBy: 'title' | 'year' | 'director' | 'star' = 'title';
  order: 'asc' | 'desc' = 'asc';

  // Dummy Data
  dummyMovies: MovieDto[] = [
    {
      id: 'tt1',
      title: 'Zebra Story',
      year: 2018,
      director: 'Alice Brown',
      rating: 7.2,
      genres: [{ id: 1, name: 'Drama' }],
      stars: [{ id: 'nm3', name: 'Chris Evans', birthYear: 1981 }]
    },
    {
      id: 'tt2',
      title: 'Alpha Movie',
      year: 2005,
      director: 'David Clark',
      rating: 8.1,
      genres: [{ id: 2, name: 'Action' }],
      stars: [{ id: 'nm1', name: 'Tom Hardy', birthYear: 1993 }]
    },
    {
      id: 'tt3',
      title: 'Middle Ground',
      year: 2012,
      director: 'Brian Adams',
      rating: 6.9,
      genres: [{ id: 3, name: 'Fiction' }],
      stars: [{ id: 'nm2', name: 'Leonardo DiCaprio', birthYear: 1980 }]
    },
    {
      id: 'tt4',
      title: 'Another Tale',
      year: 2022,
      director: 'Aaron Smith',
      rating: 7.9,
      genres: [{ id: 1, name: 'Drama' }],
      stars: [{ id: 'nm4', name: 'Brad Pitt', birthYear: 1963 }]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.page = 1;

      const genreIdParam = params.get('genreId');
      const starIdParam = params.get('starId');

      // Browse by Genre (dummy simulation)
      if (genreIdParam) {
        const genreId = Number(genreIdParam);
        const genreName = this.route.snapshot.queryParams['genreName'];

        this.contextTitle = genreName
          ? `Genre: ${genreName}`
          : 'Genre Movies';

        const filteredMovies = this.dummyMovies.filter(movie =>
          movie.genres?.some(g => g.id === genreId)
        );

        this.updateState({
          page: 1,
          pageSize: this.pageSize,
          totalResults: filteredMovies.length,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
          movies: filteredMovies
        });

        return;
      }

      //Browse by Star (dummy simulation)
      if (starIdParam) {
        this.contextTitle = 'Star Movies';

        const filteredMovies = this.dummyMovies.filter(movie =>
          movie.stars?.some(s => s.id === starIdParam)
        );

        this.updateState({
          page: 1,
          pageSize: this.pageSize,
          totalResults: filteredMovies.length,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
          movies: filteredMovies
        });

        return;
      }

      // Default: Browse all movies
      this.contextTitle = 'Browse Movies';

      this.updateState({
        page: 1,
        pageSize: this.pageSize,
        totalResults: this.dummyMovies.length,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
        movies: this.dummyMovies
      });

    });
  }

  private loadMovies(params: Params): void {

    // Browse by genre
    if (params['genreId']) {
      this.contextTitle = `Genre: ${params['genreName']}`;
      this.movieService
        .browseMoviesByGenre(+params['genreId'], this.page, this.pageSize)
        .subscribe(state => this.updateState(state));
      return;
    }

    // Browse by first letter
    if (params['letter']) {
      this.contextTitle = `Movies Starting With: ${params['letter']}`;
      this.movieService
        .browseMoviesByFirstLetter(params['letter'], this.page, this.pageSize)
        .subscribe(state => this.updateState(state));
      return;
    }

    // Search (title / director / star / year)
    this.contextTitle = 'Search Results';
    this.movieService
      .searchMovies(
        params['title'],
        params['year'],
        params['director'],
        params['star'],
        this.page,
        this.pageSize
      )
      .subscribe(state => this.updateState(state));
  }

  private updateState(state: MoviesPageStateDto): void {
    this.pageState = state;
    this.movies = state.movies;
    this.applySorting();
  }

  onSortChange(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement)
      .value as 'title' | 'year' | 'director' | 'star';
    this.applySorting();
  }

  onOrderChange(event: Event): void {
    this.order = (event.target as HTMLSelectElement)
      .value as 'asc' | 'desc';
    this.applySorting();
  }

  nextPage(): void {
    if (this.pageState.hasNext) {
      this.pageState.page++;
      this.loadMovies(this.route.snapshot.queryParams);
    }
  }

  previousPage(): void {
    if (this.pageState.hasPrev) {
      this.pageState.page--;
      this.loadMovies(this.route.snapshot.queryParams);
    }
  }

  public applySorting(): void {
    this.sortedMovies = [...this.movies].sort((a, b) => {
      const aVal = this.getSortValue(a);
      const bVal = this.getSortValue(b);

      if (aVal < bVal) return this.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getSortValue(movie: MovieDto): string | number {
    switch (this.sortBy) {
      case 'title':
        return movie.title.toLowerCase();
      case 'year':
        return movie.year;
      case 'director':
        return movie.director.toLowerCase();
      case 'star':
        if (!movie.stars || movie.stars.length === 0) return '';
        return movie.stars
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))[0]
          .name
          .toLowerCase();
    }
  }
}
