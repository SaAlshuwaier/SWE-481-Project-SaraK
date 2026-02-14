package com.swe481.backend.service.serviceInterface;

import com.swe481.backend.model.Movie;
import com.swe481.backend.model.MoviesPageState;

public interface MovieService {

        /**
         * Search movies based on multiple filters (e.g., title, year, director, star
         * name).
         * 
         * @param title    - Substring search on the movie title (ILIKE %keyword%)
         * @param year     - Exact match on movie year.
         * @param director - Substring search on director's name.
         * @param starName - Substring search on star's name.
         * @param page     - Page number (for pagination).
         * @param pageSize - Number of movies per page.
         * 
         * @return MoviesPageState containing:
         *         - List of movies
         *         - Pagination metadata (totalResults, totalPages, hasPrev, hasNext)
         */

        MoviesPageState searchMovies(
                        String title,
                        Integer year,
                        String director,
                        String starName,
                        int page,
                        int pageSize);

        /**
         * Browse movies by genre.
         * 
         * @param genreId  - The genre ID to filter movies by.
         * @param page     - Page number (for pagination).
         * @param pageSize - Number of movies per page.
         * 
         * @return MoviesPageState containing:
         *         - List of movies filtered by genre
         *         - Pagination metadata (totalResults, totalPages, hasPrev, hasNext)
         */
        MoviesPageState browseMoviesByGenre(
                        Integer genreId,
                        int page,
                        int pageSize);

        /**
         * Browse movies by the first character of their title (e.g., 'A', 'B', '2').
         * 
         * @param startsWith - The character or number that the movie titles should
         *                   start with.
         * @param page       - Page number (for pagination).
         * @param pageSize   - Number of movies per page.
         * 
         * @return MoviesPageState containing:
         *         - List of movies that start with the specified character
         *         - Pagination metadata (totalResults, totalPages, hasPrev, hasNext)
         */

        MoviesPageState browseMoviesByFirstLetter(
                        String startsWith,
                        int page,
                        int pageSize);

        /**
         * Get a single movie by its ID.
         * 
         * @param movieId - The unique ID of the movie.
         * 
         * @return Movie containing the full details of the movie:
         *         - id, title, year, director, rating, genres, stars
         */

        Movie getMovieById(String movieId);

}