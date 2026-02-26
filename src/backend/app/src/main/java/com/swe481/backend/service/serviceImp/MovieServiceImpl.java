package com.swe481.backend.service.serviceImp;

import java.util.List;

import com.swe481.backend.service.serviceInterface.MovieService;
import org.springframework.stereotype.Service;

import com.swe481.backend.model.Genre;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.MoviesPageState;
import com.swe481.backend.model.Star;

@Service
public class MovieServiceImpl implements MovieService {
    /**
     * Search movies.
     *
     * Logic:
     * - Applies optional filters (title, year, director, starName)
     * - Applies pagination
     * - Returns paged movie list
     *
     * @request GET /api/movies/search
     * @return {
     *         "page": 1,
     *         "pageSize": 20,
     *         "totalResults": 1,
     *         "totalPages": 1,
     *         "hasPrev": false,
     *         "hasNext": false,
     *         "movies": [
     *         {
     *         "id": "tt123",
     *         "title": "Inception",
     *         "year": 2010,
     *         "director": "Christopher Nolan",
     *         "rating": 4.7,
     *         "genres": [
     *         { "id": 1, "name": "Action" }
     *         ],
     *         "stars": [
     *         { "id": "1", "name": "Leonardo DiCaprio", "birthYear": 1974 }
     *         ]
     *         }
     *         ]
     *         }
     * 
     */
    @Override
    public MoviesPageState searchMovies(String title, Integer year, String director, String starName, int page,
            int pageSize) {
        // TODO: implement later (DB logic)
        return new MoviesPageState(page, pageSize, 0, java.util.List.of());
    }

    /**
     * Browse movies by genre.
     *
     * Logic:
     * - Filters movies by genreId
     * - Applies pagination (page, pageSize)
     * - Returns paged movie list with metadata
     *
     * @request GET /api/movies/browseByGenre
     * @return {
     *         "page": 1,
     *         "pageSize": 20,
     *         "totalResults": 1,
     *         "totalPages": 1,
     *         "hasPrev": false,
     *         "hasNext": false,
     *         "movies": [
     *         {
     *         "id": "tt555",
     *         "title": "The Dark Knight",
     *         "year": 2008,
     *         "director": "Christopher Nolan",
     *         "rating": 4.9,
     *         "genres": [
     *         { "id": 1, "name": "Action" }
     *         ],
     *         "stars": [
     *         { "id": "2", "name": "Christian Bale", "birthYear": 1974 }
     *         ]
     *         }
     *         ]
     *         }
     */

    @Override
    public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {
        // TODO: implement later (DB logic)
        return new MoviesPageState(page, pageSize, 0, java.util.List.of());
    }

    /**
     * Browse movies by first letter.
     *
     * Logic:
     * - Retrieves movies starting with the given character (e.g., 'A', 'B', '2')
     * - Applies pagination (page, pageSize)
     * - Returns paged movie list with metadata
     *
     * @request GET /api/movies/browseByFirstLetter
     * @return {
     *         "page": 1,
     *         "pageSize": 20,
     *         "totalResults": 1,
     *         "totalPages": 1,
     *         "hasPrev": false,
     *         "hasNext": false,
     *         "movies": [
     *         {
     *         "id": "tt777",
     *         "title": "Avatar",
     *         "year": 2009,
     *         "director": "James Cameron",
     *         "rating": 4.2,
     *         "genres": [
     *         { "id": 2, "name": "Sci-Fi" }
     *         ],
     *         "stars": [
     *         { "id": "3", "name": "Sam Worthington", "birthYear": 1976 }
     *         ]
     *         }
     *         ]
     *         }
     */
    @Override
    public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {
        // TODO: implement later (DB logic)
        return new MoviesPageState(page, pageSize, 0, java.util.List.of());
    }

    /**
     * Get movie by ID.
     *
     * Logic:
     * - Retrieves full movie details by its ID
     * - Includes genres and stars
     *
     * @request GET /api/movies/{id}
     * @return {
     *         "id": "tt999",
     *         "title": "Study",
     *         "year": 2004,
     *         "director": "Layan",
     *         "rating": 4.5,
     *         "genres": [
     *         { "id": 1, "name": "Action" },
     *         { "id": 2, "name": "Drama" }
     *         ],
     *         "stars": [
     *         { "id": "1", "name": "Tom Hanks", "birthYear": 1956 },
     *         { "id": "2", "name": "Lena Headey", "birthYear": 1973 }
     *         ]
     *         }
     */

    @Override
    public Movie getMovieById(String movieId) {
        // TODO: implement later (DB logic)

        List<Genre> genres = List.of(new Genre(1L, "Action"), new Genre(2L, "Drama"));
        List<Star> stars = List.of(
                new Star("1", "Tom Hanks", 1956),
                new Star("2", "Lena Headey", 1973));

        return new Movie(movieId, "Study", 2004, "Layan", 4.5, genres, stars);
    }
}
