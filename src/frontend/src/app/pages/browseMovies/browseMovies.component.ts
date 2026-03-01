import {Component, OnInit} from '@angular/core';
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
  pageSize: 10 | 20 | 50 | 100 = 20;

  //constants
  sortBy: "Title" | "Rating" = 'Title';
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

  private createDummyState(movies: MovieDto[]): MoviesPageStateDto {
    return {
      page: 1,
      pageSize: this.pageSize,
      totalResults: movies.length,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      movies: movies
    };
  }

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const genreId = params.get('genreId');

      this.route.queryParams.subscribe(qParams => {

        const letter = qParams['letter'];
        const genreName = qParams['genreName'];

        // First Letter
        if (letter) {
          this.contextTitle = `Title Starting With: ${letter}`;
          this.updateState(this.createDummyState(this.dummyMovies));
          return;
        }

        // Genre
        if (genreId) {
          this.contextTitle = genreName
            ? `Genre: ${genreName}`
            : 'Genre Movies';

          this.updateState(this.createDummyState(this.dummyMovies));
          return;
        }

        // Default
        this.contextTitle = 'Browsing';
        this.updateState(this.createDummyState(this.dummyMovies));

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

    //DEFAULT Search All
    this.contextTitle = 'Browsing';
    this.movieService
      .searchMovies('',
        0,
        '',
        '',
        this.page,
        this.pageSize)
      .subscribe(state => this.updateState(state));
  }

  private updateState(state: MoviesPageStateDto): void {
    this.pageState = state;
    this.movies = state.movies;
    this.applySorting();
  }

  onSortChange(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement)
      .value as 'Title' | 'Rating';
    this.applySorting();
  }

  onOrderChange(event: Event): void {
    this.order = (event.target as HTMLSelectElement)
      .value as 'asc' | 'desc';
    this.applySorting();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = Number(
      (event.target as HTMLSelectElement).value
    ) as 10 | 20 | 50 | 100;

    this.page = 1; // reset to first page, as the current page might not exist after the new page size
    this.loadMovies(this.route.snapshot.queryParams);
  }

  nextPage(): void {
    if (this.pageState.hasNext) {
      this.page++;
      this.loadMovies(this.route.snapshot.queryParams);
    }
  }

  previousPage(): void {
    if (this.pageState.hasPrev) {
      this.page--;
      this.loadMovies(this.route.snapshot.queryParams);
    }
  }

  public applySorting(): void {
    this.sortedMovies = [...this.movies];
  }

}
