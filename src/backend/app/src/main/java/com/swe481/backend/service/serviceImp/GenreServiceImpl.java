package com.swe481.backend.service.serviceImp;
import com.swe481.backend.Dto.Genre;
import com.swe481.backend.service.serviceInterface.GenreService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
//Declared as a java bean created by SB, Whenever the Interface is called this object is created(easy to change Impl later), so we don't call it in controller
public class GenreServiceImpl implements GenreService {

    private final List<Genre> genres = List.of();

    /**
     * Get all genres
     * Logic:
     * -Retrieves: all genres information
     * -Returns: list of Genres
     *
     * @return {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 10,
     *       "name": "Family",
     *     },
     *     {
     *       "id": 11,
     *       "name": "Fantasy",
     *     }
     *   ]
     * }
     */
    @Override
    public List<Genre> getAllGenres() {
        // todo : Logic of Service Added here
        return genres;
    }
}
