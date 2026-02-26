package com.swe481.backend.service.serviceImp;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.Star;
import com.swe481.backend.service.serviceInterface.StarService;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
//Declared as a java bean created by SB, Whenever the Interface is called this object is created(easy to change Impl later), so we don't call it in controller
public class StarServiceImpl implements StarService {

    private final Star star = new Star();
    private final List<Star> stars = List.of();
    private final List<Movie> movies = List.of();


    @Override
    /**
     * Get a specific star details
     * Logic:
     * -Retrieves: all Information of a star
     * -Returns: star object
     *
     * @param starId
     * @return {
     *     "success": true,
     *     "data":{
     *          "id" : "nm1651765",
     *          "name" : "Gregory Bayne",
     *          "birthYear": 1973,
     *     }
     * }
     */
    public Star getStar(String starId) {
        // todo : Logic of Service Added here
        return star ;
    }


    @Override
    /**
     * Get a list of movies for a star
     * Logic:
     * -Retrieves: all movies of a star
     * -Returns: list of Movies
     *
     * @param starId
     * @return {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": "tt0401792",
     *       "title": "Sin City",
     *       "year": 2005,
     *       "director": "Quentin Tarantino"
     *     },
     *     {
     *       "id": "tt0469641",
     *       "title": "World Trade Center",
     *       "year": 2006,
     *       "director": "Oliver Stone"
     *     }
     *   ]
     * }
     */
    public List<Movie> getStarMovies(String starId) {
          // todo : Logic of Service Added here
        return movies;
    }
}
