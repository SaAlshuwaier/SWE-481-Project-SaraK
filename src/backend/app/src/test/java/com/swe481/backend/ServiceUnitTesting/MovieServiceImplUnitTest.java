package com.swe481.backend.ServiceUnitTesting;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.MoviesPageState;
import com.swe481.backend.service.serviceImp.MovieServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test for MovieServiceImpl
 * Tests searchMovies(), browseMoviesByGenre(), browseMoviesByFirstLetter(), getMovieById() methods
 */
@ExtendWith(MockitoExtension.class) //to inject the mock class
class MovieServiceImplUnitTest {

    @InjectMocks
    private MovieServiceImpl movieService;

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
                        "Letters", 2006, "Clint Eastwood", null, 1, 10);

        assertTrue(result.getMovies().stream().allMatch(m ->
                m.getTitle().contains("Letters")
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
        assertTrue(result.getMovies().stream()
                .allMatch(m ->
                        m.getGenres().stream()
                                .anyMatch(g -> g.getId().equals(1L))));
    }

    @Test
    void shouldReturnEmptyPage_whenGenreHasNoMovies() {
        MoviesPageState result =
                movieService.browseMoviesByGenre(99, 1, 10);

        assertEquals(0, result.getTotalResults());
        assertTrue(result.getMovies().isEmpty());
    }

    @Test
    void shouldRejectNullGenreId() {
        assertThrows(IllegalArgumentException.class, () ->
                movieService.browseMoviesByGenre(null, 1, 10));
    }

    @Test
    void shouldRejectInvalidPageSize_browseMovie() {
        assertThrows(IllegalArgumentException.class, () ->
                movieService.browseMoviesByGenre(1, 1, -10));
    }
    // end of test suite for browseMoviesByGenre() method


    // test suite for browseMoviesByFirstLetter()
    @Test
    void shouldReturnMoviesStartingWithGivenLetter() {
        MoviesPageState result =
                movieService.browseMoviesByFirstLetter("A", 1, 10);

        assertFalse(result.getMovies().isEmpty());
        assertTrue(result.getMovies().stream()
                .allMatch(m ->
                        m.getTitle().toLowerCase().startsWith("a")));
    }

    @Test
    void shouldReturnEmptyPage_whenNoMoviesMatch() {
        MoviesPageState result =
                movieService.browseMoviesByFirstLetter("Z", 1, 10);

        assertEquals(0, result.getTotalResults());
        assertTrue(result.getMovies().isEmpty());
    }
    // end of test suite for browseMoviesByFirstLetter()


    // test suite for getMovieById()
    @Test
    void shouldRejectNullMovieId() {
        assertThrows(IllegalArgumentException.class, () ->
                movieService.getMovieById(null));
    }

    @Test
    void shouldRejectEmptyMovieId() {
        assertThrows(IllegalArgumentException.class, () ->
                movieService.getMovieById(""));
    }
    // end of test suite for getMovieById()

    @Test
    void getMovieByIdReturnsMovieDetails() {

        String movieId = "tt0422896";

        Movie result = movieService.getMovieById(movieId);

        assertNotNull(result);
        assertEquals(movieId, result.getId());
        assertEquals("The Other America", result.getTitle());
        assertEquals(2004, result.getYear());
        assertEquals("Eugene Martin", result.getDirector());

        // check genres and stars exist
        assertFalse(result.getGenres().isEmpty());
        assertFalse(result.getStars().isEmpty());
    }

    @Test
    void getMovieByIdWithNullId_stillReturnsObjectForNow() {

        Movie result = movieService.getMovieById(null);

        // current behavior (until real validation added)
        assertNotNull(result);
    }
}