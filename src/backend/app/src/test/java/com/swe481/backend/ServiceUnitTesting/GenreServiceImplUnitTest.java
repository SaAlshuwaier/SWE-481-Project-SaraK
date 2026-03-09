package com.swe481.backend.ServiceUnitTesting;
import static org.junit.jupiter.api.Assertions.*;
    
import org.junit.jupiter.api.Test;

import com.swe481.backend.Dto.Genre;
import com.swe481.backend.service.serviceImp.GenreServiceImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
/**
 * Unit tests for GenreServiceImpl.getAllGenres()
 *
 * Expected behavior (final implementation):
 * - Returns a non-null list
 * - List contains known genres (at least one expected item)
 * - No duplicate IDs
 *
 */

public class GenreServiceImplUnitTest {

    private GenreServiceImpl genreService = new GenreServiceImpl();
    
   
    @Test
    void getAllGenresReturnsNonNullList() {
        List<Genre> result = genreService.getAllGenres();
        assertNotNull(result);
        assertFalse(result.isEmpty(), "Expected non-empty list of genres");
    }

    //if it contain then it contains the other genres as well
    @Test
    void getAllGenresContainsFamilyGenre() { 
        List<Genre> result = genreService.getAllGenres();

        boolean exists = result.stream()
                .anyMatch(g -> g.getId() == 10 && "Family".equals(g.getName()));

        assertTrue(exists, "Expected at least one genre with id=10 and name=Family");
    }

    @Test
    void getAllGenresHasNoDuplicateIds() {
        List<Genre> result = genreService.getAllGenres();

        Set<String> seenIds = new HashSet<>();
        for (Genre g : result) {
            String id = String.valueOf(g.getId());
            assertTrue(seenIds.add(id), "Duplicate genre id found: " + id);
        }
    }
    
}


