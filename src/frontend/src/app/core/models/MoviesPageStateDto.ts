import { MovieDto } from './MovieDto';

export interface MoviesPageStateDto {
    page: number;          // Current page number
    pageSize: number;      // Movies per page

    totalResults: number;  // Total number of matched movies
    totalPages: number;    // Total pages

    hasPrev: boolean;      // True if page > 1
    hasNext: boolean;      // True if page < totalPages


    movies: MovieDto[];    // Movies for the current page
}