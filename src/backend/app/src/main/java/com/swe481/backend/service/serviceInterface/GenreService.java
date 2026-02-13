package com.swe481.backend.service.serviceInterface;
import com.swe481.backend.model.Genre;
import com.swe481.backend.model.Movie;
import java.util.List;

public interface GenreService {
    public List<Genre> getAllGenres();
    public List<Movie> getMoviesByGenre(long genreId);
}// or might be Genre object?
