package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.swe481.backend.model.Movie;
import com.swe481.backend.model.Star;
import com.swe481.backend.service.serviceImp.StarServiceImpl;

import java.util.List;

/**

* Unit tests for StarServiceImpl
*
* NOTE:
* * Current implementation returns empty/fixed data.
* * These tests verify the current behavior until real DB logic is added.
* * Tests may be updated in Phase 4 when implementation becomes dynamic.
    */
    public class StarServiceImplUnitTest {

  private final StarServiceImpl starService = new StarServiceImpl();

  
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
  assertTrue(result.isEmpty());
  assertNull(result);
  }
  }
