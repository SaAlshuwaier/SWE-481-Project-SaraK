package com.swe481.backend.service.serviceInterface;
 
import java.util.List;
 
import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.MovieSuggestion;
import com.swe481.backend.Dto.MoviesPageState;
 
public interface MovieService {
 
	MoviesPageState searchMovies(
        	String title,
        	Integer year,
        	String director,
        	String starName,
        	int page,
        	int pageSize);
 
List<MovieSuggestion> autocompleteTitles(String query);
 
	MoviesPageState browseMoviesByGenre(
        	Integer genreId,
        	int page,
        	int pageSize);
 
	MoviesPageState browseMoviesByFirstLetter(
        	String startsWith,
        	int page,
        	int pageSize);
 
	Movie getMovieById(String movieId);
}
