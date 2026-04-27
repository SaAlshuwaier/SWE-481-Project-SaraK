package com.swe481.backend.service.serviceImp;
 
import java.util.ArrayList;
import java.util.List;
 
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record5;
import org.jooq.impl.DSL;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
 
import static com.jooq.swe481.generated.tables.Movies.MOVIES;
import static com.jooq.swe481.generated.tables.Stars.STARS;
import static com.jooq.swe481.generated.tables.StarsInMovies.STARS_IN_MOVIES;
import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.MovieSuggestion;
import com.swe481.backend.Dto.MoviesPageState;
import com.swe481.backend.Dto.Repo.MovieRepository;
import com.swe481.backend.service.serviceInterface.MovieService;

@Service
public class MovieServiceImpl implements MovieService {
 
	private final DSLContext dsl;
	private final MovieRepository movieRepository;
 
	public MovieServiceImpl(DSLContext dsl, MovieRepository movieRepository) {
    	this.dsl = dsl;
    	this.movieRepository = movieRepository;
	}
 
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
	@Cacheable(value = "movieSearch", key = "{#title, #year, #director, #starName, #page, #pageSize}")
	public MoviesPageState searchMovies(String title, Integer year, String director, String starName, int page, int pageSize) {
		System.out.println("[CACHE MISS] searchMovies - title: " + title + " year: " + year + " page: " + page);
 
    	validatePaging(page, pageSize);
 
    	String normalizedTitle = normalize(title);
    	String normalizedDirector = normalize(director);
    	String normalizedStarName = normalize(starName);
 
    	Condition condition = DSL.trueCondition();
 
    	if (normalizedTitle != null) {
        	condition = condition.and(MOVIES.TITLE.containsIgnoreCase(normalizedTitle));
    	}
 
    	if (year != null) {
        	condition = condition.and(MOVIES.YEAR.eq(year));
    	}
 
    	if (normalizedDirector != null) {
        	condition = condition.and(MOVIES.DIRECTOR.containsIgnoreCase(normalizedDirector));
    	}
 
    	if (normalizedStarName != null) {
        	condition = condition.and(
                	DSL.exists(
                        	DSL.selectOne()
                                	.from(STARS_IN_MOVIES)
                                	.join(STARS).on(STARS.ID.eq(STARS_IN_MOVIES.STARID))
                                	.where(STARS_IN_MOVIES.MOVIEID.eq(MOVIES.ID))
                                	.and(STARS.NAME.containsIgnoreCase(normalizedStarName))
                	)
        	);
   	 }
 
    	int totalResults = movieRepository.countMovies(condition);
 
    	if (totalResults == 0) {
        	return new MoviesPageState(page, pageSize, 0, List.of());
    	}
 
    	List<String> movieIds = movieRepository.findMovieIds(condition, page, pageSize);
 
    	if (movieIds.isEmpty()) {
        	return new MoviesPageState(page, pageSize, totalResults, List.of());
    	}
 
    	List<Record5<String, String, Integer, String, Double>> rows = movieRepository.findMovieRows(movieIds);
 
    	List<Movie> movies = new ArrayList<>();
 
    	for (String movieId : movieIds) {
        	Record5<String, String, Integer, String, Double> row = rows.stream()
                	.filter(r -> movieId.equals(r.get(0, String.class)))
                	.findFirst()
                	.orElse(null);
 
        	if (row != null) {
            	movies.add(new Movie(
                    	row.get(0, String.class),
                    	row.get(1, String.class),
                    	row.get(2, Integer.class),
                    	row.get(3, String.class),
                    	row.get(4, Double.class),
                    	movieRepository.findGenresByMovieId(movieId),
       	             movieRepository.findStarsByMovieId(movieId)
            	));
        	}
    	}
 
    	return new MoviesPageState(page, pageSize, totalResults, movies);
	}

@Override
@Cacheable(value = "movieTitleSuggestions", key = "#query?.trim()?.toLowerCase()")
public List<MovieSuggestion> autocompleteTitles(String query) {
	String normalizedQuery = normalize(query);
 
	if (normalizedQuery == null || normalizedQuery.length() < 3) {
    	return List.of();
	}
 
	return movieRepository.findTitleSuggestions(normalizedQuery, 10);
}
 
	// Retrieves a paginated list of movies that belong to the selected genre.
	// Used by the frontend "Browse by Genre" page.
 
@Override
@Cacheable(value = "moviesByGenre", key = "{#genreId, #page, #pageSize}")
public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {
     System.out.println("[CACHE MISS] browseMoviesByGenre called - genreId: " + genreId + " page: " + page);
	validatePaging(page, pageSize);
 
	int totalResults = movieRepository.countMoviesByGenre(genreId);
 
	if (totalResults == 0) {
    	return new MoviesPageState(page, pageSize, 0, List.of());
	}
 
	List<String> movieIds = movieRepository.findMovieIdsByGenre(genreId, page, pageSize);
 
	if (movieIds.isEmpty()) {
    	return new MoviesPageState(page, pageSize, totalResults, List.of());
	}
 
	List<Record5<String, String, Integer, String, Double>> rows =
        	movieRepository.findMovieRows(movieIds);
 
	List<Movie> movies = new ArrayList<>();
 
	for (String movieId : movieIds) {
    	Record5<String, String, Integer, String, Double> row = rows.stream()
            	.filter(r -> movieId.equals(r.get(0, String.class)))
            	.findFirst()
            	.orElse(null);
 
    	if (row != null) {
        	movies.add(new Movie(
                	row.get(0, String.class),
                	row.get(1, String.class),
                	row.get(2, Integer.class),
                	row.get(3, String.class),
                	row.get(4, Double.class),
                	movieRepository.findGenresByMovieId(movieId),
                	movieRepository.findStarsByMovieId(movieId)
        	));
    	}
	}
 
	return new MoviesPageState(page, pageSize, totalResults, movies);
}


	// Retrieves a paginated list of movies whose titles start with the specified letter(s).
	// Used by the frontend "Browse by First Letter" page.
	@Override
	@Cacheable(value = "moviesByFirstLetter", key = "{#startsWith, #page, #pageSize}")
	public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {
	System.out.println("[CACHE MISS] browseMoviesByFirstLetter - startsWith: " + startsWith + " page: " + page);

 
	// Validate and sanitize input parameters for pagination and filtering.   
	validatePaging(page, pageSize);
 
	if (startsWith == null || startsWith.isBlank()) {
    	return new MoviesPageState(page, pageSize, 0, List.of());
    }
 
	int totalResults = movieRepository.countMoviesByFirstLetter(startsWith);
 
	if (totalResults == 0) {
    	return new MoviesPageState(page, pageSize, 0, List.of());
	}
 
	// fetch movie IDs that match the first letter filter with pagination applied at the database level for efficiency.
	List<String> movieIds = movieRepository.findMovieIdsByFirstLetter(startsWith, page, pageSize);
 
	if (movieIds.isEmpty()) {
    	return new MoviesPageState(page, pageSize, totalResults, List.of());
	}
 
	List<Record5<String, String, Integer, String, Double>> rows = movieRepository.findMovieRows(movieIds);
 
	List<Movie> movies = new ArrayList<>();
 
	for (String movieId : movieIds) {
    	Record5<String, String, Integer, String, Double> row = rows.stream()
            	.filter(r -> movieId.equals(r.get(0, String.class)))
            	.findFirst()
            	.orElse(null);
 
    	if (row != null) {
        	movies.add(new Movie(
      	          row.get(0, String.class),
                	row.get(1, String.class),
                	row.get(2, Integer.class),
                	row.get(3, String.class),
                	row.get(4, Double.class),
                	movieRepository.findGenresByMovieId(movieId),
                	movieRepository.findStarsByMovieId(movieId)
        	));
    	}
	}
 
	return new MoviesPageState(page, pageSize, totalResults, movies);
}
@Override
@Cacheable(value = "movieById", key = "#movieId")
public Movie getMovieById(String movieId) {
	System.out.println("[CACHE MISS] getMovieById - movieId: " + movieId);
	if (movieId == null || movieId.isBlank()) {
    	throw new IllegalArgumentException("movieId must not be null or blank");
	}
 
	var movieRowOpt = movieRepository.findMovieRowById(movieId);
 
	if (movieRowOpt.isEmpty()) {
    	return null;
	}
 
	var row = movieRowOpt.get();
 
	Movie movie = new Movie();
	movie.setId(row.get(0, String.class));
	movie.setTitle(row.get(1, String.class));
	movie.setYear(row.get(2, Integer.class));
	movie.setDirector(row.get(3, String.class));
	movie.setRating(row.get(4, Double.class));
 
	movie.setGenres(movieRepository.findGenresByMovieId(movieId));
	movie.setStars(movieRepository.findStarsByMovieId(movieId));
 
	return movie;
}
 
	private void validatePaging(int page, int pageSize) {
    	if (page < 1) {
        	throw new IllegalArgumentException("Page must be greater than or equal to 1.");
    	}
 
    	if (pageSize < 1 || pageSize > 100) {
        	throw new IllegalArgumentException("Page size must be between 1 and 100.");
    	}
	}
 
	private String normalize(String value) {
    	if (value == null || value.isBlank()) {
        	return null;
    	}
    	return value.trim();
	}
 
	private MoviesPageState paginate(List<Movie> source, int page, int pageSize) {
 
    	int totalResults = source.size();
    	int fromIndex = Math.max(0, (page - 1) * pageSize);
    	int toIndex = Math.min(fromIndex + pageSize, totalResults);
 
    	List<Movie> pageItems =
            	fromIndex >= totalResults ? List.of() : source.subList(fromIndex, toIndex);
 
    	return new MoviesPageState(page, pageSize, totalResults, pageItems);
	}
}
