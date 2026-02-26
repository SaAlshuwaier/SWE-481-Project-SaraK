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

  constructor(private movieService: MovieService) {}

  //Browsing context will be routed later, taken from the homePage
  genreId = 1;
  currentGenre = 'Drama';

  //using the Backend-driven state of paging here. dummy data for now
  pageState: MoviesPageStateDto = {
    page: 1,
    pageSize: 20,
    totalResults: 0,
    totalPages: 2,
    hasPrev: false,
    hasNext: false,
    movies: []
  };
  //Dummy for now, here the returned movies from the backend
  movies: MovieDto[] = [
    {
      id: 'tt1',
      title: 'Zebra Story',
      year: 2018,
      director: 'Alice Brown',
      rating: 7.2,
      genres: [{ id: 1, name: 'Drama' }],
      stars: [
        { id: 'nm3', name: 'Chris Evans', birthYear: 1981 }
      ]
    },
    {
      id: 'tt2',
      title: 'Alpha Movie',
      year: 2005,
      director: 'David Clark',
      rating: 8.1,
      genres: [{ id: 2, name: 'Action' }],
      stars: [
        { id: 'nm1', name: 'Tom Hardy', birthYear: 1993 }
      ]
    },
    {
      id: 'tt3',
      title: 'Middle Ground',
      year: 2012,
      director: 'Brian Adams',
      rating: 6.9,
      genres: [{ id: 3, name: 'Fiction' }],
      stars: [
        { id: 'nm2', name: 'Leonardo DiCaprio', birthYear: 1980 }
      ]
    },
    {
      id: 'tt4',
      title: 'Another Tale',
      year: 2022,
      director: 'Aaron Smith',
      rating: 7.9,
      genres: [{ id: 1, name: 'Drama' }],
      stars: [
        { id: 'nm4', name: 'Brad Pitt', birthYear: 1963 }
      ]
    }
  ];

  //sorting done on frontend, the copy the frontend will display
  sortedMovies: MovieDto[] = [];

  //for sort and order
  sortBy: 'title' | 'year' | 'director' | 'star' = 'title';
  order: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
   // this.loadMovies(1); for backend integration
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

  /**
   * Pages handling
   */
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
      case 'star': {
        if (!movie.stars || movie.stars.length === 0) {
          return '';
        }
        // sort stars alphabetically and take the first one
        return movie.stars
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))[0]
          .name
          .toLowerCase();
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
