package com.swe481.backend.ControllerIntegrationTesting;
import com.swe481.backend.model.Genre;
import com.swe481.backend.ServiceUnitTesting.serviceInterface.GenreService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class GenreController {

    //We call the interface, on run? it will be injected with GenreServiceImpl
    private final GenreService genreService;
    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping("/genres")
    public ResponseEntity<List<Genre>> getAllGenres(){
        return ResponseEntity.ok(genreService.getAllGenres());
    }

}
