package com.swe481.backend.ServiceUnitTesting.serviceInterface;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.Star;
import java.util.List;

public interface StarService {
    public Star getStar(String starId);
    public List<Star> getStarsOfMovie(String movieId);
    public List<Movie> getStarMovies(String starId);
}
