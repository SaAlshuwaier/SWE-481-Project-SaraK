package com.swe481.backend.service.serviceImp;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record5;
import org.jooq.impl.DSL;
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
import com.swe481.backend.Dto.Repo.MovieRepository;
import com.swe481.backend.Dto.Star;
import com.swe481.backend.service.serviceInterface.MovieService;

@Service
public class MovieServiceImpl implements MovieService {

    private final DSLContext dsl;
    private final MovieRepository movieRepository;

    public MovieServiceImpl(DSLContext dsl, MovieRepository movieRepository) {
        this.dsl = dsl;
        this.movieRepository = movieRepository;
    }

    /**
     * Search movies.
     *
     * Logic:
     * - Applies optional filters (title, year, director, starName)
     * - Applies pagination
     * - Returns paged movie list
     *
     * @request GET /api/movies/search
     * @return {
     *         "page": 1,
     *         "pageSize": 20,
     *         "totalResults": 1,
     *         "totalPages": 1,
     *         "hasPrev": false,
     *         "hasNext": false,
     *         "movies": [
     *         {
     *         "id": "tt123",
     *         "title": "Inception",
     *         "year": 2010,
     *         "director": "Christopher Nolan",
     *         "rating": 4.7,
     *         "genres": [
     *         { "id": 1, "name": "Action" }
     *         ],
     *         "stars": [
     *         { "id": "1", "name": "Leonardo DiCaprio", "birthYear": 1974 }
     *         ]
     *         }
     *         ]
     *         }
     *
     */
    @Override
    public MoviesPageState searchMovies(String title, Integer year, String director, String starName, int page, int pageSize) {

        validatePaging(page, pageSize);

        String normalizedTitle = normalize(title);
        String normalizedDirector = normalize(director);
        String normalizedStarName = normalize(starName);

        Condition condition = DSL.trueCondition();

        if (normalizedTitle != null) {
            condition = condition.and(MOVIES.TITLE.containsIgnoreCase(normalizedTitle));
        }

        if (year != null) {
            condition = condition.and(MOVIES.YEAR.eq(year));
        }

        if (normalizedDirector != null) {
            condition = condition.and(MOVIES.DIRECTOR.containsIgnoreCase(normalizedDirector));
        }

        if (normalizedStarName != null) {
            condition = condition.and(
                    DSL.exists(
                            DSL.selectOne()
                                    .from(STARS_IN_MOVIES)
                                    .join(STARS).on(STARS.ID.eq(STARS_IN_MOVIES.STARID))
                                    .where(STARS_IN_MOVIES.MOVIEID.eq(MOVIES.ID))
                                    .and(STARS.NAME.containsIgnoreCase(normalizedStarName))
                    )
            );
        }

        int totalResults = movieRepository.countMovies(condition);

        if (totalResults == 0) {
            return new MoviesPageState(page, pageSize, 0, List.of());
        }

        List<String> movieIds = movieRepository.findMovieIds(condition, page, pageSize);

        if (movieIds.isEmpty()) {
            return new MoviesPageState(page, pageSize, totalResults, List.of());
        }

        List<Record5<String, String, Integer, String, Double>> rows = movieRepository.findMovieRows(movieIds);

        List<Movie> movies = new ArrayList<>();

        for (String movieId : movieIds) {
            Record5<String, String, Integer, String, Double> row = rows.stream()
                    .filter(r -> movieId.equals(r.get(0, String.class)))
                    .findFirst()
                    .orElse(null);

            if (row != null) {
                movies.add(new Movie(
                        row.get(0, String.class),
                        row.get(1, String.class),
                        row.get(2, Integer.class),
                        row.get(3, String.class),
                        row.get(4, Double.class),
                        movieRepository.findGenresByMovieId(movieId),
                        movieRepository.findStarsByMovieId(movieId)
                ));
            }
        }

        return new MoviesPageState(page, pageSize, totalResults, movies);
    }

    /* 
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
    ); */

    // Retrieves a paginated list of movies that belong to the selected genre.
    // Used by the frontend "Browse by Genre" page.
    @Override
    public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {

        // // Ensure page and page size are valid before applying pagination.
        int safePage = Math.max(page, 1);
        int safePageSize = Math.max(pageSize, 1);
        int offset = (safePage - 1) * safePageSize;

        // Query movies filtered by genre using the join table between movies and genres.
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

        // Map the query result into Movie DTOs for the browse page.    
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

        // // Count total matching movies to support frontend pagination.
        int total = dsl
                .selectCount()
                .from(MOVIES)
                .join(GenresInMovies.GENRES_IN_MOVIES)
                .on(MOVIES.ID.eq(GenresInMovies.GENRES_IN_MOVIES.MOVIEID))
                .where(GenresInMovies.GENRES_IN_MOVIES.GENREID.eq(genreId))
                .fetchOne(0, int.class);

        return new MoviesPageState(safePage, safePageSize, total, movies);
    }




    // Retrieves a paginated list of movies whose titles start with the specified letter(s).
    // Used by the frontend "Browse by First Letter" page.
    @Override
public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {

    // Validate and sanitize input parameters for pagination and filtering.    
    validatePaging(page, pageSize);

    if (startsWith == null || startsWith.isBlank()) {
        return new MoviesPageState(page, pageSize, 0, List.of());
    }

    int totalResults = movieRepository.countMoviesByFirstLetter(startsWith);

    if (totalResults == 0) {
        return new MoviesPageState(page, pageSize, 0, List.of());
    }

    // fetch movie IDs that match the first letter filter with pagination applied at the database level for efficiency.
    List<String> movieIds = movieRepository.findMovieIdsByFirstLetter(startsWith, page, pageSize);

    if (movieIds.isEmpty()) {
        return new MoviesPageState(page, pageSize, totalResults, List.of());
    }

    List<Record5<String, String, Integer, String, Double>> rows = movieRepository.findMovieRows(movieIds);

    List<Movie> movies = new ArrayList<>();

    for (String movieId : movieIds) {
        Record5<String, String, Integer, String, Double> row = rows.stream()
                .filter(r -> movieId.equals(r.get(0, String.class)))
                .findFirst()
                .orElse(null);

        if (row != null) {
            movies.add(new Movie(
                    row.get(0, String.class),
                    row.get(1, String.class),
                    row.get(2, Integer.class),
                    row.get(3, String.class),
                    row.get(4, Double.class),
                    movieRepository.findGenresByMovieId(movieId),
                    movieRepository.findStarsByMovieId(movieId)
            ));
        }
    }

    return new MoviesPageState(page, pageSize, totalResults, movies);
}
@Override
public Movie getMovieById(String movieId) {
    if (movieId == null || movieId.isBlank()) {
        throw new IllegalArgumentException("movieId must not be null or blank");
    }

    var movieRowOpt = movieRepository.findMovieRowById(movieId);

    if (movieRowOpt.isEmpty()) {
        return null;
    }

    var row = movieRowOpt.get();

    Movie movie = new Movie();
    movie.setId(row.get(0, String.class));
    movie.setTitle(row.get(1, String.class));
    movie.setYear(row.get(2, Integer.class));
    movie.setDirector(row.get(3, String.class));
    movie.setRating(row.get(4, Double.class));

    movie.setGenres(movieRepository.findGenresByMovieId(movieId));
    movie.setStars(movieRepository.findStarsByMovieId(movieId));

    return movie;
}

    private void validatePaging(int page, int pageSize) {
        if (page < 1) {
            throw new IllegalArgumentException("Page must be greater than or equal to 1.");
        }

        if (pageSize < 1 || pageSize > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100.");
        }
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private MoviesPageState paginate(List<Movie> source, int page, int pageSize) {

        int totalResults = source.size();
        int fromIndex = Math.max(0, (page - 1) * pageSize);
        int toIndex = Math.min(fromIndex + pageSize, totalResults);

        List<Movie> pageItems =
                fromIndex >= totalResults ? List.of() : source.subList(fromIndex, toIndex);

        return new MoviesPageState(page, pageSize, totalResults, pageItems);
    }
}