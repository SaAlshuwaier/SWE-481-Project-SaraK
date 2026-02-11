package com.swe481.backend.controller;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.Star;
import com.swe481.backend.service.serviceInterface.StarService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/api")
public class StarController {

    private final StarService starService;
    public StarController(StarService starService, StarService star) {
        this.starService = starService;
    }

    @GetMapping("movies/{movieId}/stars")
    public List<Star> getStarsOfMovie(
            @PathVariable String movieId
    ) {
        return starService.getStarsOfMovie(movieId);
    }

    @GetMapping("stars/{starId}")
    public Star getStar(
            @PathVariable String starId
    ) {
        return starService.getStar(starId);
    }

    @GetMapping("/stars/{starId}/movies")
    public  List<Movie> getStarMovies(
            @PathVariable String starId
    ){
        return starService.getStarMovies(starId);
     }
}
