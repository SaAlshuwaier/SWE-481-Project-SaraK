package com.swe481.backend.service.serviceImp;
import com.swe481.backend.model.Genre;
import com.swe481.backend.model.Movie;
import com.swe481.backend.service.serviceInterface.GenreService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
//Declared as a java bean created by SB, Whenever the Interface is called this object is created(easy to change Impl later), so we don't call it in controller
public class GenreServiceImpl implements GenreService {

    @Override
    public List<Genre> getAllGenres() {
        // todo : Logic of Service Added here
        return null;
    }

    @Override
    public Genre getGenre(String genreId) {
        // todo : Logic of Service Added here
        return null;
    }

    @Override
   public List<Movie> getMoviesByGenre(Genre genre) {
   // todo : Logic of Service Added here
       return null;
    }
}
