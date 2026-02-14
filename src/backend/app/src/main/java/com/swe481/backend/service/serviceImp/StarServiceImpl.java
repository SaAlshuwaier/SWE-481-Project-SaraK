package com.swe481.backend.service.serviceImp;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.Star;
import com.swe481.backend.service.serviceInterface.StarService;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
//Declared as a java bean created by SB, Whenever the Interface is called this object is created(easy to change Impl later), so we don't call it in controller
public class StarServiceImpl implements StarService {


    /**
     * Get a specific star details
     * Logic:
     * -Retrives all Information of a star
     * -Returns a Star object
     *
     * @request GET /api/stars/{starId}
     * @return {
     *     "success": true,
     *     "data":{
     *         "id" : "nm1651765",
     *          "name" : "Gregory Bayne",
     *           1973,
     *
     *
     *     }
     * }
     */
    @Override
    public Star getStar(String starId) {
        // todo : Logic of Service Added here
        return null ;
    }

    @Override
    public List<Star> getStarsOfMovie(String movieId) {
        // todo : Logic of Service Added here
        return null;
    }

    @Override
    public List<Movie> getStarMovies(String starId) {
          // todo : Logic of Service Added here
        return null;
    }
}
