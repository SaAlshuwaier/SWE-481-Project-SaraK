package com.swe481.backend.Dto.Repo;

import com.swe481.backend.Dto.Genre;
import com.swe481.backend.Dto.Star;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record5;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.jooq.swe481.generated.tables.Movies.MOVIES;
import static com.jooq.swe481.generated.tables.Ratings.RATINGS;
import static com.jooq.swe481.generated.tables.Stars.STARS;
import static com.jooq.swe481.generated.tables.StarsInMovies.STARS_IN_MOVIES;
import static com.jooq.swe481.generated.tables.Genres.GENRES;
import static com.jooq.swe481.generated.tables.GenresInMovies.GENRES_IN_MOVIES;

@Repository
public class MovieRepository {

    private final DSLContext dsl;

    public MovieRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public int countMovies(Condition condition) {
        return dsl
                .selectCount()
                .from(MOVIES)
                .where(condition)
                .fetchOne(0, int.class);
    }

    public List<String> findMovieIds(Condition condition, int page, int pageSize) {
        int offset = (page - 1) * pageSize;

        return dsl
                .select(MOVIES.ID)
                .from(MOVIES)
                .where(condition)
                .orderBy(MOVIES.TITLE.asc(), MOVIES.ID.asc())
                .limit(pageSize)
                .offset(offset)
                .fetch(MOVIES.ID);
    }

    public List<Record5<String, String, Integer, String, Double>> findMovieRows(List<String> movieIds) {
        return dsl
                .select(
                        MOVIES.ID,
                        MOVIES.TITLE,
                        MOVIES.YEAR,
                        MOVIES.DIRECTOR,
                        DSL.coalesce(RATINGS.RATING.cast(Double.class), DSL.inline(0.0)).as("rating")
                )
                .from(MOVIES)
                .leftJoin(RATINGS).on(RATINGS.MOVIEID.eq(MOVIES.ID))
                .where(MOVIES.ID.in(movieIds))
                .fetch();
    }

    // This method retrieves the genres associated with a specific movie ID by performing a join between the GENRES and GENRES_IN_MOVIES tables 
    // to retrieve the genre information for the specified movie, and then maps the results to a list of Genre DTOs.
    public List<Genre> findGenresByMovieId(String movieId) {
        return dsl
                .select(GENRES.ID, GENRES.NAME)
                .from(GENRES)
                // Join table used to map movies to their genres (many-to-many relationship)
                .join(GENRES_IN_MOVIES).on(GENRES.ID.eq(GENRES_IN_MOVIES.GENREID))
                .where(GENRES_IN_MOVIES.MOVIEID.eq(movieId))
                .orderBy(GENRES.NAME.asc())
                .fetch(record -> new Genre(
                        record.get(GENRES.ID).longValue(),
                        record.get(GENRES.NAME)
                ));
    }



    public List<Star> findStarsByMovieId(String movieId) {
        return dsl
                .select(STARS.ID, STARS.NAME, STARS.BIRTHYEAR)
                .from(STARS)
                .join(STARS_IN_MOVIES).on(STARS.ID.eq(STARS_IN_MOVIES.STARID))
                .where(STARS_IN_MOVIES.MOVIEID.eq(movieId))
                .orderBy(STARS.NAME.asc())
                .fetch(record -> new Star(
                        record.get(STARS.ID),
                        record.get(STARS.NAME),
                        record.get(STARS.BIRTHYEAR) == null ? 0 : record.get(STARS.BIRTHYEAR)
                ));
    }


    // Retrieves all available genres from the database.
    // Used to populate the genre browsing menu so users can browse
    // movies by a selected genre.
    public List<Genre> findAllGenres() {
        return dsl
                .select(GENRES.ID, GENRES.NAME)
                .from(GENRES)
                // Order genres alphabetically by name for better user experience in the genre browsing menu.
                .orderBy(GENRES.NAME.asc())
                .fetch(record -> new Genre(
                        record.get(GENRES.ID).longValue(),
                        record.get(GENRES.NAME)
                ));
    }


    
    // This method counts the total number of movies that start with the given letter (or digit) for pagination purposes.
    public int countMoviesByFirstLetter(String startsWith) {
    Condition condition;

    if (startsWith != null && startsWith.matches("\\d")) {
        condition = MOVIES.TITLE.likeIgnoreCase(startsWith + "%");
    } else {
        condition = MOVIES.TITLE.startsWithIgnoreCase(startsWith);
    }

    return dsl
            .selectCount()
            .from(MOVIES)
            .where(condition)
            .fetchOne(0, int.class);
}

// This method retrieves a paginated list of movie IDs for movies whose titles start with the specified letter (or digit).
public List<String> findMovieIdsByFirstLetter(String startsWith, int page, int pageSize) {
        // Calculate the offset for pagination based on the current page number and page size.
    int offset = (page - 1) * pageSize;

    Condition condition;

    // If the startsWith parameter is a digit, we use a case-insensitive like condition. Otherwise, we use a case-insensitive startsWith condition.
    if (startsWith != null && startsWith.matches("\\d")) {
        condition = MOVIES.TITLE.likeIgnoreCase(startsWith + "%");
    } else {
        condition = MOVIES.TITLE.startsWithIgnoreCase(startsWith);
    }

    return dsl
            .select(MOVIES.ID)
            .from(MOVIES)
            .where(condition)
            .orderBy(MOVIES.TITLE.asc(), MOVIES.ID.asc())
            .limit(pageSize)
            .offset(offset)
            .fetch(MOVIES.ID);
}

public Optional<Record5<String, String, Integer, String, Double>> findMovieRowById(String movieId) {
    return dsl
            .select(
                    MOVIES.ID,
                    MOVIES.TITLE,
                    MOVIES.YEAR,
                    MOVIES.DIRECTOR,
                    DSL.coalesce(RATINGS.RATING.cast(Double.class), DSL.inline(0.0)).as("rating")
            )
            .from(MOVIES)
            .leftJoin(RATINGS).on(RATINGS.MOVIEID.eq(MOVIES.ID))
            .where(MOVIES.ID.eq(movieId))
            .fetchOptional();
}
}
