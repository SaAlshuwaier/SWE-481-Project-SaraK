package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.Star;
import com.swe481.backend.Dto.Repo.StarRepository;
import com.swe481.backend.service.serviceImp.StarServiceImpl;
import com.swe481.backend.service.serviceInterface.StarService;

import java.util.List;

import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * 
 * Unit tests for StarServiceImpl
 *
 * NOTE:
 * * Current implementation returns empty/fixed data.
 * * These tests verify the current behavior until real DB logic is added.
 * * Tests may be updated in Phase 4 when implementation becomes dynamic.
 */
@ExtendWith(MockitoExtension.class)
public class StarServiceImplUnitTest {
  @Mock
  private StarRepository mockRepo;
  private StarService starService;

  @BeforeEach
  void setUp() {

    starService = new StarServiceImpl(mockRepo);
  }

  // getStar tests

  @Test
  void getStarReturnsNonNullObject() {
    Mockito.when(mockRepo.findById("nm1651765"))
        .thenReturn(new Star("nm1651765", "Gregory Bayne", 1973));
    Star result = starService.getStar("nm1651765");
    assertNotNull(result);
  }

  @Test
  void getStarMoviesReturnsNonNullList() {
    Mockito.when(mockRepo.findMoviesByStarId("nm1651765"))
        .thenReturn(List.of(new Movie("tt0395796", "Trudell", 2005, "Heather Rae", 6.3, null, null)));

    List<Movie> result = starService.getStarMovies("nm1651765");

    assertEquals("tt0395796", result.get(0).getId());
    assertEquals("Trudell", result.get(0).getTitle());
    assertEquals(2005, result.get(0).getYear());
    assertEquals("Heather Rae", result.get(0).getDirector());
    assertNotNull(result);
  }

  @Test
  void getStarMoviesInitiallyEmpty() {
    Mockito.when(mockRepo.findMoviesByStarId("nm1651765"))
        .thenReturn(List.of(new Movie("tt0395796", "Trudell", 2005, "Heather Rae", 6.3, null, null)));
    List<Movie> result = starService.getStarMovies("nm1651765");
    assertFalse(result.isEmpty());
  }

}
