import { Component, OnInit } from '@angular/core';
import {MoviesPageStateDto} from '../../core/models/MoviesPageStateDto';
import {MovieDto} from '../../core/models/MovieDto';
import {MovieService} from '../../core/services/MovieService';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-browse-movies',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './browseMovies.component.html',
  styleUrls: ['./browseMovies.component.css']
})
export class BrowseMoviesComponent implements OnInit {

  //Browsing context will be routed later
  genreId = 1;
  currentGenre = 'Drama';

  //using the Backend-driven state. dummy data for now
  pageState: MoviesPageStateDto = {
    page: 1,
    pageSize: 20,
    totalResults: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
    movies: []
  };

  movies: MovieDto[] = [
    {
      id: 'tt1',
      title: 'Dummy Movie A',
      year: 2005,
      director: 'Director Z',
      rating: 7.8,
      genres: [
        { id: 1, name: 'Drama' },
        { id: 2, name: 'Action' }
      ],
      stars: [
        { id: 'nm1', name: 'Tom Hardy' , birthYear:1993},
        { id: 'nm2', name: 'Leonardo DiCaprio',birthYear:1980}
      ]
    },
    {
      id: 'tt1',
      title: 'Dummy Movie A',
      year: 2005,
      director: 'Director Z',
      rating: 7.8,
      genres: [
        { id: 1, name: 'Drama' },
        { id: 2, name: 'fiction' }
      ],
      stars: [
        { id: 'nm1', name: 'Tom Hardy' , birthYear:1993},
        { id: 'nm2', name: 'Leonardo DiCaprio',birthYear:1980}
      ]
    },
  ];

  //sorting done on frontend
  sortedMovies: MovieDto[] = [];

  //for sort and order
  sortBy: 'title' | 'year' | 'director' | 'star' = 'title';
  order: 'asc' | 'desc' = 'asc';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
   // this.loadMovies(1); for backend
    this.applySorting();
  }

  loadMovies(page: number): void {
    this.movieService
      .browseMoviesByGenre(this.genreId, page, 20)
      .subscribe(state => {
        this.pageState = state;
        this.movies = state.movies;
        this.applySorting(); //what the frontEnd applies
      });
  }

  nextPage(): void {
    if (this.pageState.hasNext) {
      this.loadMovies(this.pageState.page + 1);
    }
  }

  previousPage(): void {
    if (this.pageState.hasPrev) {
      this.loadMovies(this.pageState.page - 1);
    }
  }


  private getSortValue(movie: MovieDto): string | number {
    switch (this.sortBy) {

      case 'title':
        return movie.title.toLowerCase();

      case 'year':
        return movie.year;

      case 'director':
        return movie.director.toLowerCase();

      // We use the FIRST star alphabetically to keep
      // sorting deterministic and consistent.
      case 'star': {
        return movie.director.toLowerCase(); //SEEETHIS
      }
    }
  }

  /**
   * Triggered when the user changes the "Sort By" option.
   * Sorting or ordering is re-applied without reloading data from backend.
   */
  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy = value as 'title' | 'year' | 'director' | 'star';
    this.applySorting();
  }
  onOrderChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.order = value as 'asc' | 'desc';
    this.applySorting();
  }


  /**
   * Applies frontend sorting to the movies of the CURRENT page.
   *
   * This method should be called when:
   *  - a new page is loaded from the backend
   *  - the sort field changes
   *  - the sort order changes
   */
  applySorting(): void {
    // Clone the array to avoid mutating backend state
    this.sortedMovies = [...this.movies].sort((a, b) => {
      const aVal = this.getSortValue(a);
      const bVal = this.getSortValue(b);

      if (aVal < bVal) return this.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
