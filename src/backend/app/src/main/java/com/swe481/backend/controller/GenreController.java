package com.swe481.backend.controller;
import com.swe481.backend.model.Genre;
import com.swe481.backend.service.serviceInterface.GenreService;
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
    public List<Genre> getAllGenres(){
        return genreService.getAllGenres();
    }


}
