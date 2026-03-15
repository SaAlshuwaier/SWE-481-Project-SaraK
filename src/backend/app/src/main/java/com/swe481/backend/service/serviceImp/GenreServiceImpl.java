package com.swe481.backend.service.serviceImp;

import java.util.List;

import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import static com.jooq.swe481.generated.tables.Genres.GENRES;
import com.swe481.backend.Dto.Genre;
import com.swe481.backend.service.serviceInterface.GenreService;


@Service
// This service implementation class provides methods to interact with the genres data in the database. It uses jOOQ's DSLContext to execute SQL queries and map the results to Genre DTOs.
// used be Home page "Browse by Genre" section and Movie search results to display genre information for movies.
public class GenreServiceImpl implements GenreService {

    private final DSLContext dsl;

    public GenreServiceImpl(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<Genre> getAllGenres() {
        return dsl
                .selectFrom(GENRES)
                .orderBy(GENRES.NAME.asc())
                .fetch()
                .map(record -> new Genre(
                        record.getId().longValue(),
                        record.getName()
                ));
    }
}