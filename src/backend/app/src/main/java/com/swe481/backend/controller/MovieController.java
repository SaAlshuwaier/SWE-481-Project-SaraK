package com.swe481.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.MoviesPageState;
import com.swe481.backend.service.serviceInterface.MovieService;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/movies")

public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<?> getMovies(
            @RequestParam(required = false) String simulate,
            @RequestParam(required = false, defaultValue = "0") long delay) {

        if (simulate == null) {
            MoviesPageState result = movieService.searchMovies(null, null, null, null, 1, 20);
            return ResponseEntity.ok(result);
        }

        switch (simulate) {
            case "db-down":
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "Service unavailable. Please try again later."));

            case "db-slow":
                try {
                    long sleepTime = delay > 0 ? delay : 3000;
                    Thread.sleep(sleepTime);
                    if (sleepTime > 5000) {
                        return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                                .body(Map.of("error", "Database response timed out."));
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                            .body(Map.of("error", "Request interrupted. Service unavailable."));
                }
                return ResponseEntity.ok(movieService.searchMovies(null, null, null, null, 1, 20));

            case "pool-exhausted":
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "Service is too busy. Please try again later."));

            case "timeout":
                try {
                    long sleepTime = Math.min(delay > 0 ? delay : 5000, 7000); // cap at 7s
                    Thread.sleep(sleepTime);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                        .body(Map.of("error", "Request timed out."));

            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Unknown simulate value: " + simulate));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<MoviesPageState> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String director,
            @RequestParam(required = false) String starName,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {

        // Call the service to get movies based on filters
        MoviesPageState result = movieService.searchMovies(title, year, director, starName, page, pageSize);

        return ResponseEntity.ok(result);
    }

    /**
     * Browse movies by genre
     * 
     * @param genreId  - Genre ID to filter movies by.
     * @param page     - Page number (for pagination).
     * @param pageSize - Number of movies per page.
     * @return MoviesPageState containing the list of movies filtered by genre.
     */

    // This endpoint is used by the Home page "Browse by Genre" section. When a user clicks on a genre, it sends a request to this endpoint with the genre ID, and the backend returns a paginated list of movies that belong to that genre.
    @GetMapping("/browseByGenre")
    public ResponseEntity<MoviesPageState> browseMoviesByGenre(
            @RequestParam Integer genreId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {

        // Call the service to browse movies by genre
        MoviesPageState result = movieService.browseMoviesByGenre(genreId, page, pageSize);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/browseByFirstLetter")
    public ResponseEntity<MoviesPageState> browseMoviesByFirstLetter(
            @RequestParam String startsWith,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {

        // Call the service to browse movies by the first letter of title
        MoviesPageState result = movieService.browseMoviesByFirstLetter(startsWith, page, pageSize);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        // Call the service to get the movie details by ID
        Movie movie = movieService.getMovieById(id);

        if (movie == null) {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }

        return ResponseEntity.ok(movie);
    }
}
