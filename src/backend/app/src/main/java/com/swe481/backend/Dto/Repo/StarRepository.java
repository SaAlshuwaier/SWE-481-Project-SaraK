package com.swe481.backend.Dto.Repo;

import com.swe481.backend.Dto.Movie;
import com.swe481.backend.Dto.Star;
import com.jooq.swe481.generated.tables.pojos.Stars;
import com.jooq.swe481.generated.tables.pojos.Movies;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static com.jooq.swe481.generated.tables.Stars.STARS;
import static com.jooq.swe481.generated.tables.StarsInMovies.STARS_IN_MOVIES;
import static com.jooq.swe481.generated.tables.Movies.MOVIES;

@Repository
public class StarRepository {

        private final DSLContext dsl;

        public StarRepository(DSLContext dsl) {
                this.dsl = dsl;
        }

        public Star findById(String starId) {
                // Step 1 - fetch into generated POJO a
                Stars generated = dsl
                                .selectFrom(STARS)
                                .where(STARS.ID.eq(starId))
                                .fetchOneInto(Stars.class);

                if (generated == null)
                        return null;

                // Step 2 - convert to your DTO
                return new Star(
                                generated.getId(),
                                generated.getName(),
                                generated.getBirthyear());
        }

        public List<Movie> findMoviesByStarId(String starId) {
                // Step 1 - fetch into generated POJO
                List<Movies> generated = dsl
                                .select(MOVIES.ID, MOVIES.TITLE)
                                .from(MOVIES)
                                .join(STARS_IN_MOVIES).on(MOVIES.ID.eq(STARS_IN_MOVIES.MOVIEID))
                                .where(STARS_IN_MOVIES.STARID.eq(starId))
                                .fetchInto(Movies.class);
                if (generated == null)
                        return null;
                // Step 2 - convert to your DTO you control field names
                return generated.stream()
                                .map(m -> new Movie(
                                                m.getId(),
                                                m.getTitle(),
                                                null, null, 0, null, null))
                                .collect(Collectors.toList());
        }
}