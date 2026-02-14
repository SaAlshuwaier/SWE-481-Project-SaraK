import { MovieDto } from './MovieDto';

export interface MoviesPageStateDto {
    page: number;          // Current page number
    pageSize: number;      // Movies per page

    totalResults: number;  // Total number of matched movies
    totalPages: number;    // Total pages

    hasPrev: boolean;      // True if page > 1
    hasNext: boolean;      // True if page < totalPages

    sortBy?: string;        // Sorting field (title or rating) - even if FE controls it
    order?: string;         // Sorting direction (asc or desc)

    movies: MovieDto[];    // Movies for the current page
}