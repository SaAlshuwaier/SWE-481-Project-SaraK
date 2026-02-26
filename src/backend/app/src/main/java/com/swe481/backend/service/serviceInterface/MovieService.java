package com.swe481.backend.ServiceUnitTesting.serviceInterface;

import com.swe481.backend.model.Movie;
import com.swe481.backend.model.MoviesPageState;

public interface MovieService {

        MoviesPageState searchMovies(
                        String title,
                        Integer year,
                        String director,
                        String starName,
                        int page,
                        int pageSize);

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