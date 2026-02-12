package com.swe481.backend.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class MoviesPageState {

    private int page;
    // Current page number requested by the user.

    private int pageSize;
    // Number of movies displayed per page.

    private int totalResults;
    // Total number of movies matching the search criteria.

    private int totalPages;
    // Total number of pages (calculated from totalResults / pageSize).

    private boolean hasPrev;
    // True if there is a previous page (page > 1).

    private boolean hasNext;
    // True if there is a next page (page < totalPages).

    private String sortBy;
    // Field used for sorting (title or rating).

    private String order;
    // Sorting direction (asc or desc).

    private List<Movie> movies;
    // List of movies for the current page only.

    public MoviesPageState() {
    }

    public MoviesPageState(int page, int pageSize, int totalResults,
            String sortBy, String order,
            List<Movie> movies) {

        this.page = page;
        this.pageSize = pageSize;
        this.totalResults = totalResults;
        this.totalPages = (int) Math.ceil((double) totalResults / pageSize);
        this.hasPrev = page > 1;
        this.hasNext = page < totalPages;
        this.sortBy = sortBy;
        this.order = order;
        this.movies = movies;
    }
}
