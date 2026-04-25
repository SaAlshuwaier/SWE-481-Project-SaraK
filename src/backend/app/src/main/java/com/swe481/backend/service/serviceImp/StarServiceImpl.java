package com.swe481.backend.service.serviceImp;

import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.Star;
import com.swe481.backend.Dto.Repo.StarRepository;

import com.swe481.backend.service.serviceInterface.StarService;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
// Declared as a java bean created by SB, Whenever the Interface is called this
// object is created(easy to change Impl later), so we don't call it in
// controller
public class StarServiceImpl implements StarService {

    private final StarRepository starRepository;

    public StarServiceImpl(StarRepository starRepository) {
        this.starRepository = starRepository;
    }

    @Override
    @Cacheable(value = "starById", key = "#starId")
    public Star getStar(String starId) {
        if (starId == null || starId.isBlank())
            return null;
        return starRepository.findById(starId);
    }

    @Override
    @Cacheable(value = "starMovies", key = "#starId")
    public List<Movie> getStarMovies(String starId) {
        if (starId == null || starId.isBlank())
            return null;
        return starRepository.findMoviesByStarId(starId);
    }
}
