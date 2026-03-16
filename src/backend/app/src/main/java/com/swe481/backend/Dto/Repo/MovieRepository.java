package com.swe481.backend.Dto.Repo;

import com.swe481.backend.Dto.Genre;
import com.swe481.backend.Dto.Star;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record5;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    public List<Genre> findGenresByMovieId(String movieId) {
        return dsl
                .select(GENRES.ID, GENRES.NAME)
                .from(GENRES)
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

    public List<Genre> findAllGenres() {
        return dsl
                .select(GENRES.ID, GENRES.NAME)
                .from(GENRES)
                .orderBy(GENRES.NAME.asc())
                .fetch(record -> new Genre(
                        record.get(GENRES.ID).longValue(),
                        record.get(GENRES.NAME)
                ));
    }


}
