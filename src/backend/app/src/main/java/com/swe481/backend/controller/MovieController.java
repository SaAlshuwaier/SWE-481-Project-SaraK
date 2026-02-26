package com.swe481.backend.controller;

import com.swe481.backend.model.Movie;
import com.swe481.backend.model.MoviesPageState;
import com.swe481.backend.service.serviceInterface.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/movies")

public class MovieController {

    private final MovieService movieService;
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
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
