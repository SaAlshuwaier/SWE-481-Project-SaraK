package com.swe481.backend.service.serviceInterface;
import java.util.List;

import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.Star;

public interface StarService {
    public Star getStar(String starId);
    public List<Movie> getStarMovies(String starId);
}
