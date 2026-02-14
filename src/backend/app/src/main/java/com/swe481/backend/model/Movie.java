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

    private String id; // Movie's ID
    private String title; // Movie's Title
    private Integer year; // Movie's Release Year
    private String director; // Movie's Director
    private double rating; // Movie's Rating

    // Hyperlinked lists
    private List<Genre> genres; // List of genres associated with the movie
    private List<Star> stars; // List of stars associated with the movie

}
