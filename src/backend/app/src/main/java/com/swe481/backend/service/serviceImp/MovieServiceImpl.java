package com.swe481.backend.service.serviceImp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.swe481.backend.model.Genre;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.MoviesPageState;
import com.swe481.backend.model.Star;
import com.swe481.backend.service.serviceInterface.MovieService;

@Service
public class MovieServiceImpl implements MovieService {
    @Override
    public MoviesPageState searchMovies(String title, Integer year, String director, String starName, int page,
            int pageSize) {
        // TODO: implement later (DB logic)
        return new MoviesPageState(page, pageSize, 0, null, null, java.util.List.of());
    }

    @Override
    public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {
        // TODO: implement later (DB logic)
        return new MoviesPageState(page, pageSize, 0, null, null, java.util.List.of());
    }

    @Override
    public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {
        // TODO: implement later (DB logic)
        return new MoviesPageState(page, pageSize, 0, null, null, java.util.List.of());
    }

    @Override
    public Movie getMovieById(String movieId) {
        // TODO: implement later (DB logic)

        List<Genre> genres = List.of(new Genre(1L, "Action"), new Genre(2L, "Drama"));
        List<Star> stars = List.of(
                new Star("1", "Tom Hanks", 1956),
                new Star("2", "Lena Headey", 1973));

        return new Movie(movieId, "Study", 2004, "Layan", 4.5, genres, stars);
    }
}
