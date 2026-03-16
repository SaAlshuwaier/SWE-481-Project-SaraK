package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.swe481.backend.Dto.Genre;
import com.swe481.backend.Dto.Repo.MovieRepository;
import com.swe481.backend.service.serviceImp.GenreServiceImpl;

@ExtendWith(MockitoExtension.class)
public class GenreServiceImplUnitTest {

    @Mock
    private MovieRepository movieRepository;

    private GenreServiceImpl genreService;

    @BeforeEach
    void setUp() {
        genreService = new GenreServiceImpl(movieRepository);
    }

    @Test
    void getAllGenresReturnsNonNullList() {
        List<Genre> mockGenres = List.of(
                new Genre(10L, "Family"),
                new Genre(2L, "Action")
        );

        when(movieRepository.findAllGenres()).thenReturn(mockGenres);

        List<Genre> result = genreService.getAllGenres();
        assertNotNull(result);
        assertFalse(result.isEmpty(), "Expected non-empty list of genres");
    }

    @Test
    void getAllGenresContainsFamilyGenre() {
        List<Genre> mockGenres = List.of(
                new Genre(10L, "Family"),
                new Genre(2L, "Action")
        );

        when(movieRepository.findAllGenres()).thenReturn(mockGenres);

        List<Genre> result = genreService.getAllGenres();

        boolean exists = result.stream()
                .anyMatch(g -> g.getId() == 10 && "Family".equals(g.getName()));

        assertTrue(exists, "Expected at least one genre with id=10 and name=Family");
    }

    @Test
    void getAllGenresHasNoDuplicateIds() {
        List<Genre> mockGenres = List.of(
                new Genre(10L, "Family"),
                new Genre(2L, "Action"),
                new Genre(5L, "Drama")
        );

        when(movieRepository.findAllGenres()).thenReturn(mockGenres);

        List<Genre> result = genreService.getAllGenres();

        Set<String> seenIds = new HashSet<>();
        for (Genre g : result) {
            String id = String.valueOf(g.getId());
            assertTrue(seenIds.add(id), "Duplicate genre id found: " + id);
        }
    }
}