package com.swe481.backend.service.serviceImp;

import java.util.List;
import java.util.stream.Collectors;

import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import static com.jooq.swe481.generated.tables.Genres.GENRES;
import com.jooq.swe481.generated.tables.GenresInMovies;
import static com.jooq.swe481.generated.tables.Movies.MOVIES;
import static com.jooq.swe481.generated.tables.Ratings.RATINGS;
import static com.jooq.swe481.generated.tables.Stars.STARS;
import static com.jooq.swe481.generated.tables.StarsInMovies.STARS_IN_MOVIES;
import com.swe481.backend.Dto.Genre;
import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.MoviesPageState;
import com.swe481.backend.Dto.Star;
import com.swe481.backend.service.serviceInterface.MovieService;

@Service
public class MovieServiceImpl implements MovieService {
// JOOQ DSLContext is injected into the service to allow it to execute SQL queries against the database. This service implementation provides methods for searching movies, browsing movies by genre or first letter, and retrieving movie details by ID. It also includes a dummy dataset of movies for testing purposes, which is used in the search and browse methods to simulate database interactions before the actual database integration is implemented.
    private final DSLContext dsl;

    public MovieServiceImpl(DSLContext dsl) {
        this.dsl = dsl;
    }

    private final List<Movie> dummyMovies = List.of(
            new Movie(
                    "tt1",
                    "Zebra Story",
                    2018,
                    "Alice Brown",
                    7.2,
                    List.of(new Genre(1L, "Drama")),
                    List.of(new Star("nm3", "Chris Evans", 1981))
            ),
            new Movie(
                    "tt2",
                    "Alpha Movie",
                    2005,
                    "David Clark",
                    8.1,
                    List.of(new Genre(2L, "Action")),
                    List.of(new Star("nm1", "Tom Hardy", 1977))
            ),
            new Movie(
                    "tt3",
                    "Middle Ground",
                    2012,
                    "Brian Adams",
                    6.9,
                    List.of(new Genre(3L, "Fiction")),
                    List.of(new Star("nm2", "Leonardo DiCaprio", 1974))
            ),
            new Movie(
                    "tt4",
                    "Another Tale",
                    2022,
                    "Aaron Smith",
                    7.9,
                    List.of(new Genre(1L, "Drama"), new Genre(4L, "Comedy")),
                    List.of(new Star("nm4", "Brad Pitt", 1963))
            )
    );

    @Override
public MoviesPageState searchMovies(String title, Integer year, String director, String starName, int page, int pageSize) {

    int safePage = Math.max(page, 1);
    int safePageSize = Math.max(pageSize, 1);
    int offset = (safePage - 1) * safePageSize;

    // Start building the query from the movies table
    var query = dsl
            .selectDistinct(
                    MOVIES.ID,
                    MOVIES.TITLE,
                    MOVIES.YEAR,
                    MOVIES.DIRECTOR
            )
            .from(MOVIES);

    // Apply filters only if values are provided
    org.jooq.Condition condition = org.jooq.impl.DSL.trueCondition();

    if (title != null && !title.isBlank()) {
        condition = condition.and(MOVIES.TITLE.containsIgnoreCase(title));
    }

    if (year != null && year != 0) {
        condition = condition.and(MOVIES.YEAR.eq(year));
    }

    if (director != null && !director.isBlank()) {
        condition = condition.and(MOVIES.DIRECTOR.containsIgnoreCase(director));
    }

    // If star name is provided, filter movies through stars_in_movies and stars tables
    if (starName != null && !starName.isBlank()) {
        condition = condition.and(
                MOVIES.ID.in(
                        dsl.select(STARS_IN_MOVIES.MOVIEID)
                                .from(STARS_IN_MOVIES)
                                .join(STARS)
                                .on(STARS.ID.eq(STARS_IN_MOVIES.STARID))
                                .where(STARS.NAME.containsIgnoreCase(starName))
                )
        );
    }

    // Fetch paginated search results
    var result = query
            .where(condition)
            .orderBy(MOVIES.TITLE.asc())
            .limit(safePageSize)
            .offset(offset)
            .fetch();

    // Map database records into Movie DTO objects
    List<Movie> movies = result.map(r ->
            new Movie(
                    r.get(MOVIES.ID),
                    r.get(MOVIES.TITLE),
                    r.get(MOVIES.YEAR),
                    r.get(MOVIES.DIRECTOR),
                    0.0,
                    List.of(),
                    List.of()
            )
    );

    // Count total matching results for pagination
    int total = dsl
            .selectCount()
            .from(MOVIES)
            .where(condition)
            .fetchOne(0, int.class);

    return new MoviesPageState(safePage, safePageSize, total, movies);
}

    @Override
    public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {

        int safePage = Math.max(page, 1);
        int safePageSize = Math.max(pageSize, 1);
        int offset = (safePage - 1) * safePageSize;

        // The following jOOQ query retrieves a paginated list of movies that belong to the specified genre. It joins the MOVIES table with the GenresInMovies table to filter movies by genre ID, and it orders the results by movie title. The total count of movies for the given genre is also retrieved to support pagination in the frontend.
        var result = dsl
                .selectDistinct(
                        MOVIES.ID,
                        MOVIES.TITLE,
                        MOVIES.YEAR,
                        MOVIES.DIRECTOR
                )
                .from(MOVIES)
                .join(GenresInMovies.GENRES_IN_MOVIES)
                .on(MOVIES.ID.eq(GenresInMovies.GENRES_IN_MOVIES.MOVIEID))
                .where(GenresInMovies.GENRES_IN_MOVIES.GENREID.eq(genreId))
                .orderBy(MOVIES.TITLE.asc())
                .limit(safePageSize)
                .offset(offset)
                .fetch();

                // Map the jOOQ result to a list of Movie DTOs. Since this is a simplified example, the rating, genres, and stars are not included in the query and are set to default values in the Movie constructor.
        List<Movie> movies = result.map(r ->
                new Movie(
                        r.get(MOVIES.ID),
                        r.get(MOVIES.TITLE),
                        r.get(MOVIES.YEAR),
                        r.get(MOVIES.DIRECTOR),
                        0.0,
                        List.of(),
                        List.of()
                )
        );

        // Get the total count of movies for the given genre to support pagination
        int total = dsl
                .selectCount()
                .from(MOVIES)
                .join(GenresInMovies.GENRES_IN_MOVIES)
                .on(MOVIES.ID.eq(GenresInMovies.GENRES_IN_MOVIES.MOVIEID))
                .where(GenresInMovies.GENRES_IN_MOVIES.GENREID.eq(genreId))
                .fetchOne(0, int.class);

        return new MoviesPageState(safePage, safePageSize, total, movies);
    }

    @Override
    public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {

        List<Movie> filtered = dummyMovies.stream()
                .filter(m -> startsWith == null || startsWith.isBlank()
                        || m.getTitle().toUpperCase().startsWith(startsWith.toUpperCase()))
                .collect(Collectors.toList());

        return paginate(filtered, page, pageSize);
    }

    @Override
public Movie getMovieById(String movieId) {

    var movieRecord = dsl
            .select(
                    MOVIES.ID,
                    MOVIES.TITLE,
                    MOVIES.YEAR,
                    MOVIES.DIRECTOR
            )
            .from(MOVIES)
            .where(MOVIES.ID.eq(movieId))
            .fetchOne();

    if (movieRecord == null) {
        return null;
    }

    var ratingRecord = dsl
            .select(RATINGS.RATING)
            .from(RATINGS)
            .where(RATINGS.MOVIEID.eq(movieId))
            .fetchOne();

    double finalRating = 0.0;
    if (ratingRecord != null && ratingRecord.get(RATINGS.RATING) != null) {
        finalRating = ratingRecord.get(RATINGS.RATING);
    }

    List<Genre> genres = dsl
            .select(
                    GENRES.ID,
                    GENRES.NAME
            )
            .from(GENRES)
            .join(GenresInMovies.GENRES_IN_MOVIES)
            .on(GENRES.ID.eq(GenresInMovies.GENRES_IN_MOVIES.GENREID))
            .where(GenresInMovies.GENRES_IN_MOVIES.MOVIEID.eq(movieId))
            .orderBy(GENRES.NAME.asc())
            .fetch(record -> new Genre(
                    record.get(GENRES.ID).longValue(),
                    record.get(GENRES.NAME)
            ));

    List<Star> stars = dsl
        .select(
                STARS.ID,
                STARS.NAME,
                STARS.BIRTHYEAR
        )
        .from(STARS)
        .join(STARS_IN_MOVIES)
        .on(STARS.ID.eq(STARS_IN_MOVIES.STARID))
        .where(STARS_IN_MOVIES.MOVIEID.eq(movieId))
        .orderBy(STARS.NAME.asc())
        .fetch(record -> {
            Integer birthYear = record.get(STARS.BIRTHYEAR);

            return new Star(
                    record.get(STARS.ID),
                    record.get(STARS.NAME),
                    birthYear
            );
        });

    return new Movie(
            movieRecord.get(MOVIES.ID),
            movieRecord.get(MOVIES.TITLE),
            movieRecord.get(MOVIES.YEAR),
            movieRecord.get(MOVIES.DIRECTOR),
            finalRating,
            genres,
            stars
    );
}

    // This helper method takes a list of movies and paginates it based on the provided page number and page size. It calculates the total number of results, determines the correct sublist for the requested page, and returns a MoviesPageState object containing the pagination information and the list of movies for that page.
    private MoviesPageState paginate(List<Movie> source, int page, int pageSize) {

        int totalResults = source.size();
        int fromIndex = Math.max(0, (page - 1) * pageSize);
        int toIndex = Math.min(fromIndex + pageSize, totalResults);

        List<Movie> pageItems =
                fromIndex >= totalResults ? List.of() : source.subList(fromIndex, toIndex);

        return new MoviesPageState(page, pageSize, totalResults, pageItems);
    }
}