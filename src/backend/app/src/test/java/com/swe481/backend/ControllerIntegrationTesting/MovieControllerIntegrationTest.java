package com.swe481.backend.ControllerIntegrationTesting;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration test for MovieController
 * Tests /api/movies endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class MovieControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final String endPoint = "/api/movies";

    @Test
    void searchMovies_shouldReturnMoviesPageState() throws Exception {
        mockMvc.perform(
                        get(endPoint + "/search")
                                .param("title", "inception")
                                .param("page", "1")
                                .param("pageSize", "20")
                )
                .andExpect(status().isOk())

                // Contract: MoviesPageState
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(20))
                .andExpect(jsonPath("$.totalResults").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber())
                .andExpect(jsonPath("$.hasPrev").isBoolean())
                .andExpect(jsonPath("$.hasNext").isBoolean())
                .andExpect(jsonPath("$.movies").isArray())

                // Contract: Movie
                .andExpect(jsonPath("$.movies[0].id").isString())
                .andExpect(jsonPath("$.movies[0].title").isString())
                .andExpect(jsonPath("$.movies[0].year").isNumber())
                .andExpect(jsonPath("$.movies[0].director").isString())
                .andExpect(jsonPath("$.movies[0].rating").isNumber())
                .andExpect(jsonPath("$.movies[0].genres").isArray())
                .andExpect(jsonPath("$.movies[0].stars").isArray());
    }

    @Test
    void browseMoviesByFirstLetter_shouldReturnPagedMovies() throws Exception {
        mockMvc.perform(
                        get(endPoint + "/browseByFirstLetter")
                                .param("startsWith", "r")
                                .param("page", "1")
                                .param("pageSize", "20")
                )
                .andExpect(status().isOk())

                // check response json matching
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.movies").isArray());

    }

    @Test
    void browseMoviesByGenre_shouldReturnMoviesPageState() throws Exception {
        mockMvc.perform(
                        get("/api/movies/browseByGenre")
                                .param("genreId", "28")
                                .param("page", "1")
                                .param("pageSize", "20")
                )
                .andExpect(status().isOk())
                // check response json matching
                .andExpect(jsonPath("$.movies").isArray())
                .andExpect(jsonPath("$.hasNext").isBoolean());
    }

    @Test
    void GetMovieById_shouldReturnMovie() throws Exception {
        mockMvc.perform(
                        get(endPoint + "/{id}", "tt999")
                )
                .andExpect(status().isOk())
                // Contract: Movie
                .andExpect(jsonPath("$.id").isString())
                .andExpect(jsonPath("$.title").isString())
                .andExpect(jsonPath("$.year").isNumber())
                .andExpect(jsonPath("$.director").isString())
                .andExpect(jsonPath("$.rating").isNumber())
                .andExpect(jsonPath("$.genres").isArray())
                .andExpect(jsonPath("$.stars").isArray());
    }
}





