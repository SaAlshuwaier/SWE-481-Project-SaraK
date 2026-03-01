package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.swe481.backend.model.Movie;
import com.swe481.backend.service.serviceImp.MovieServiceImpl;

public class MovieServiceImplUnitTesting {

    private final MovieServiceImpl movieService = new MovieServiceImpl();

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