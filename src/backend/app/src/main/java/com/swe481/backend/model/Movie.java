package com.swe481.backend.model;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Movie {

    private String id;
    private String title;
    private Integer year;
    private String director;
    private double rating;
    // hyperlinked lists
    private List<Genre> genres;
    private List<Star> stars;
}