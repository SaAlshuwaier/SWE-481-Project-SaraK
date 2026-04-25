package com.swe481.backend.service.serviceImp;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.swe481.backend.Dto.Genre;
import com.swe481.backend.Dto.Repo.MovieRepository;
import com.swe481.backend.service.serviceInterface.GenreService;

@Service
public class GenreServiceImpl implements GenreService {

    private final MovieRepository movieRepository;

    public GenreServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    @Cacheable(value = "genres")
    public List<Genre> getAllGenres() {
        return movieRepository.findAllGenres();
    }
}