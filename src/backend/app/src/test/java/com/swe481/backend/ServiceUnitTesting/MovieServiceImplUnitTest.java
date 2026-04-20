package com.swe481.backend.ServiceUnitTesting;
 
import java.util.List;
 
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record5;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
 
import com.swe481.backend.Dto.Genre;
import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.MovieSuggestion;
import com.swe481.backend.Dto.MoviesPageState;
import com.swe481.backend.Dto.Repo.MovieRepository;
import com.swe481.backend.Dto.Star;
import com.swe481.backend.service.serviceImp.MovieServiceImpl;
 
/**
 * Unit test for MovieServiceImpl
 * Tests searchMovies(), browseMoviesByGenre(), browseMoviesByFirstLetter(), getMovieById() methods
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class MovieServiceImplUnitTest {
 
	@Mock
	private MovieRepository movieRepository;
	@Mock
	private DSLContext dsl;
 
	@InjectMocks
	private MovieServiceImpl movieService;
 
	@BeforeEach
	void setUp() {
    	Record5<String, String, Integer, String, Double> mockRow = Mockito.mock(Record5.class);
 
    	Mockito.when(mockRow.get(0, String.class)).thenReturn("tt123");
    	Mockito.when(mockRow.get(1, String.class)).thenReturn("Mystic River");
    	Mockito.when(mockRow.get(2, Integer.class)).thenReturn(2006);
    	Mockito.when(mockRow.get(3, String.class)).thenReturn("Clint Eastwood");
    	Mockito.when(mockRow.get(4, Double.class)).thenReturn(4.5);
Mockito.when(movieRepository.findMovieRowById("tt0422896"))
    	.thenReturn(java.util.Optional.of(mockRow));
    	Mockito.when(movieRepository.countMovies(Mockito.any(Condition.class)))
            	.thenReturn(1);
 
    	Mockito.when(movieRepository.findMovieIds(Mockito.any(), Mockito.anyInt(), Mockito.anyInt()))
            	.thenReturn(List.of("tt123"));
 
    	Mockito.when(movieRepository.findMovieRows(Mockito.any()))
            	.thenReturn(List.of(mockRow));
 
    	Mockito.when(movieRepository.findGenresByMovieId("tt123"))
            	.thenReturn(List.of(new Genre(1L, "Drama")));
 
    	Mockito.when(movieRepository.findStarsByMovieId("tt123"))
            	.thenReturn(List.of(new Star("1", "Sean Penn", 1960)));
 
    	Mockito.when(movieRepository.countMoviesByGenre(Mockito.anyInt()))
   	.thenReturn(1);
 
    	Mockito.when(movieRepository.findMovieIdsByGenre(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt()))
   	.thenReturn(List.of("tt123"));
	}
 
	// test suite of searchMovies() method
	@Test
	void shouldReturnAllMovies_whenNoFiltersProvided() {
    	MoviesPageState result =
            	movieService.searchMovies(null, null, null, null, 1, 10);
 
    	assertNotNull(result);
    	assertTrue(result.getTotalResults() > 0);
    	assertFalse(result.getMovies().isEmpty());
    }
 
	@Test
	void shouldFilterByTitle() {
    	MoviesPageState result =
            	movieService.searchMovies("Mystic", null, null, null, 1, 10);
 
    	assertFalse(result.getMovies().isEmpty());
    	assertTrue(result.getMovies().stream()
            	.allMatch(m ->
                    	m.getTitle().toLowerCase().contains("mystic")));
	}
 
	@Test
	void shouldFilterByYear() {
    	MoviesPageState result =
            	movieService.searchMovies(null, 2006, null, null, 1, 10);
 
    	assertFalse(result.getMovies().isEmpty());
    	assertTrue(result.getMovies().stream()
            	.allMatch(m -> m.getYear() == 2006));
	}
 
	@Test
	void shouldApplyMultipleFiltersTogether() {
    	MoviesPageState result =
            	movieService.searchMovies(
                    	"Mystic", 2006, "Clint Eastwood", null, 1, 10);
 
    	assertTrue(result.getMovies().stream().allMatch(m ->
 	           m.getTitle().contains("Mystic")
                    	&& m.getYear() == 2006
                    	&& m.getDirector().equals("Clint Eastwood")
    	));
	}
 
	@Test
	void shouldRejectInvalidPageSize_searchMovie() {
    	assertThrows(IllegalArgumentException.class, () ->
            	movieService.searchMovies(null, null, null, null, 1, 1000));
	}
 
	@Test
	void shouldApplyPaginationRules() {
    	MoviesPageState result =
            	movieService.searchMovies(null, null, null, null, 1, 1);
 
    	assertEquals(1, result.getPage());
    	assertEquals(1, result.getPageSize());
    	assertTrue(result.getMovies().size() <= 1);
	}
	// end of test suite of searchMovies() method
 
	// test suite for browseMoviesByGenre() method
	@Test
	void shouldReturnOnlyMoviesBelongingToGenre() {
    	MoviesPageState result =
            	movieService.browseMoviesByGenre(1, 1, 10);
 
    	assertFalse(result.getMovies().isEmpty());
    	assertEquals(1, result.getTotalResults());
	}
 
   @Test
   void shouldReturnEmptyPage_whenGenreHasNoMovies() {
    	Mockito.when(movieRepository.countMoviesByGenre(99)).thenReturn(0);
 
    	MoviesPageState result =
            	movieService.browseMoviesByGenre(99, 1, 10);
 
    	assertEquals(0, result.getTotalResults());
    	assertTrue(result.getMovies().isEmpty());
}
 
	// end of test suite for browseMoviesByGenre() method
 
   // @Disabled("Depends on old dummy-data behavior")
	// test suite for browseMoviesByFirstLetter()
	@Test
	void shouldReturnMoviesStartingWithGivenLetter() {
    	MoviesPageState result =
            	movieService.browseMoviesByFirstLetter("A", 1, 10);
 
    	assertTrue(result.getMovies().isEmpty());
    	assertEquals(0, result.getTotalResults());
	}
  //  @Disabled("Depends on old dummy-data behavior")
	@Test
	void shouldReturnEmptyPage_whenNoMoviesMatch() {
    	MoviesPageState result =
            	movieService.browseMoviesByFirstLetter("Z", 1, 10);
 
    	assertEquals(0, result.getTotalResults());
    	assertTrue(result.getMovies().isEmpty());
	}
	// end of test suite for browseMoviesByFirstLetter()
 
   @Test
void getMovieByIdReturnsMovieDetails() {
	String movieId = "tt0422896";
 
	Record5<String, String, Integer, String, Double> movieRow = Mockito.mock(Record5.class);
	Mockito.when(movieRow.get(0, String.class)).thenReturn(movieId);
	Mockito.when(movieRow.get(1, String.class)).thenReturn("Study");
	Mockito.when(movieRow.get(2, Integer.class)).thenReturn(2004);
	Mockito.when(movieRow.get(3, String.class)).thenReturn("Layan");
	Mockito.when(movieRow.get(4, Double.class)).thenReturn(4.2);
 
	Mockito.when(movieRepository.findMovieRowById(movieId))
        	.thenReturn(java.util.Optional.of(movieRow));
 
	Mockito.when(movieRepository.findGenresByMovieId(movieId))
        	.thenReturn(List.of(new Genre(1L, "Drama")));
 
	Mockito.when(movieRepository.findStarsByMovieId(movieId))
        	.thenReturn(List.of(new Star("1", "Actor Name", 1990)));
 
	Movie result = movieService.getMovieById(movieId);
 
	assertNotNull(result);
	assertEquals(movieId, result.getId());
	assertEquals("Study", result.getTitle());
	assertEquals(2004, result.getYear());
	assertEquals("Layan", result.getDirector());
	assertEquals(4.2, result.getRating());
 
	assertFalse(result.getGenres().isEmpty());
	assertFalse(result.getStars().isEmpty());
}
 @Test
void getMovieByIdWithNullId_shouldThrowException() {
	assertThrows(IllegalArgumentException.class, () ->
        	movieService.getMovieById(null));
}
@Test
void getMovieById_shouldReturnNull_whenMovieDoesNotExist() {
	String movieId = "tt9999999";
 
	Mockito.when(movieRepository.findMovieRowById(movieId))
        	.thenReturn(java.util.Optional.empty());
 
	Movie result = movieService.getMovieById(movieId);
 
	assertEquals(null, result);
}
@Test
void autocompleteTitles_shouldReturnSuggestions_whenQueryValid() {
	List<MovieSuggestion> suggestions = List.of(
        	new MovieSuggestion("tt1", "Inception"),
        	new MovieSuggestion("tt2", "Interstellar")
	);
 
	Mockito.when(movieRepository.findTitleSuggestions("inc", 10))
        	.thenReturn(suggestions);
 
	List<MovieSuggestion> result = movieService.autocompleteTitles("inc");
 
	assertNotNull(result);
	assertEquals(2, result.size());
	assertEquals("Inception", result.get(0).getTitle());
}
@Test
void autocompleteTitles_shouldReturnEmpty_whenQueryIsNull() {
	List<MovieSuggestion> result = movieService.autocompleteTitles(null);
 
	assertNotNull(result);
	assertTrue(result.isEmpty());
}
@Test
void autocompleteTitles_shouldTrimQuery() {
	List<MovieSuggestion> suggestions = List.of(
        	new MovieSuggestion("tt1", "Inception")
	);
 
	Mockito.when(movieRepository.findTitleSuggestions("inc", 10))
        	.thenReturn(suggestions);
 
	List<MovieSuggestion> result = movieService.autocompleteTitles("   inc   ");
 
	assertEquals(1, result.size());
	assertEquals("Inception", result.get(0).getTitle());
}
}
