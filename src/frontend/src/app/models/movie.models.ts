// here we define the Movie interface and the MoviesPageState interface

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  rating: number;
}

export interface MoviesPageState {
  movies: Movie[];
  page: number;
  pageSize: number;
  totalMovies: number;
  totalPages: number;
}