package com.swe481.backend.controller;
 
import java.util.List;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
 
import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.MoviesPageState;
import com.swe481.backend.service.serviceInterface.MovieService;
import com.swe481.backend.Dto.MovieSuggestion;
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
 
    	MoviesPageState result = movieService.searchMovies(title, year, director, starName, page, pageSize);
    	return ResponseEntity.ok(result);
	}
 
 @GetMapping("/autocomplete")
public ResponseEntity<List<MovieSuggestion>> autocompleteTitles(
    	@RequestParam String query) {
 
	List<MovieSuggestion> suggestions = movieService.autocompleteTitles(query);
	return ResponseEntity.ok(suggestions);
}
 
	@GetMapping("/browseByGenre")
	public ResponseEntity<MoviesPageState> browseMoviesByGenre(
        	@RequestParam Integer genreId,
        	@RequestParam(defaultValue = "1") int page,
        	@RequestParam(defaultValue = "20") int pageSize) {
 
    	MoviesPageState result = movieService.browseMoviesByGenre(genreId, page, pageSize);
    	return ResponseEntity.ok(result);
	}
 
	@GetMapping("/browseByFirstLetter")
	public ResponseEntity<MoviesPageState> browseMoviesByFirstLetter(
        	@RequestParam String startsWith,
        	@RequestParam(defaultValue = "1") int page,
        	@RequestParam(defaultValue = "20") int pageSize) {
 
    	MoviesPageState result = movieService.browseMoviesByFirstLetter(startsWith, page, pageSize);
    	return ResponseEntity.ok(result);
	}
 
	@GetMapping("/{id}")
	public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
    	Movie movie = movieService.getMovieById(id);
 
    	if (movie == null) {
        	return ResponseEntity.notFound().build();
    	}
 
    	return ResponseEntity.ok(movie);
	}
}
