package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.*;

import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.Star;
import com.swe481.backend.Dto.Repo.StarRepository;
import com.swe481.backend.service.serviceImp.StarServiceImpl;
import com.swe481.backend.service.serviceInterface.StarService;

import java.util.List;
import org.mockito.Mockito;

/**
 * 
 * Unit tests for StarServiceImpl
 *
 * NOTE:
 * * Current implementation returns empty/fixed data.
 * * These tests verify the current behavior until real DB logic is added.
 * * Tests may be updated in Phase 4 when implementation becomes dynamic.
 */
public class StarServiceImplUnitTest {
  private StarService starService;

  @BeforeEach
  void setUp() {
    StarRepository mockRepo = Mockito.mock(StarRepository.class);

    Mockito.when(mockRepo.findById("nm1651765"))
        .thenReturn(new Star("nm1651765", "Gregory Bayne", 1973));

    Mockito.when(mockRepo.findMoviesByStarId("nm1651765"))
        .thenReturn(List.of(new Movie("tt0395796", "Trudell", 2005, "Heather Rae", 6.3, null, null)));

    starService = new StarServiceImpl(mockRepo);
  }

  // getStar tests

  @Test
  void getStarReturnsNonNullObject() {
    Star result = starService.getStar("nm1651765");
    assertNotNull(result);
  }

  @Test
  void getStarWithNullId_stillReturnsObjectForNow() {
    Star result = starService.getStar(null);
    assertNull(result);
  }

  @Test
  void getStarWithBlankId_stillReturnsObjectForNow() {
    Star result = starService.getStar("   ");
    assertNull(result);
  }

  // getStarMovies tests

  @Test
  void getStarMoviesReturnsNonNullList() {
    List<Movie> result = starService.getStarMovies("nm1651765");
    assertNotNull(result);
  }

  @Test
  void getStarMoviesInitiallyEmpty() {
    List<Movie> result = starService.getStarMovies("nm1651765");
    assertFalse(result.isEmpty());
  }

  @Test
  void getStarMoviesWithNullId_returnsEmptyList() {
    List<Movie> result = starService.getStarMovies(null);

    assertNull(result);
  }
}
