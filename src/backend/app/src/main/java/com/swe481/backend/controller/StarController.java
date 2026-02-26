package com.swe481.backend.ControllerIntegrationTesting;
import com.swe481.backend.model.Movie;
import com.swe481.backend.model.Star;
import com.swe481.backend.ServiceUnitTesting.serviceInterface.StarService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/api")
public class StarController {

    private final StarService starService;
    public StarController(StarService starService) {
        this.starService = starService;
    }

    @GetMapping("/stars/{starId}")
    public ResponseEntity<Star> getStar(
            @PathVariable String starId
    ) {
        return ResponseEntity.ok(starService.getStar(starId));
    }

    @GetMapping("/movies/{movieId}/stars")
    public ResponseEntity<List<Star>> getStarsOfMovie(
            @PathVariable String movieId
    ) {
        return ResponseEntity.ok(starService.getStarsOfMovie(movieId));
    }

    @GetMapping("/stars/{starId}/movies")
    public ResponseEntity<List<Movie>> getStarMovies(
            @PathVariable String starId
    ){
        return ResponseEntity.ok(starService.getStarMovies(starId));
     }
}
