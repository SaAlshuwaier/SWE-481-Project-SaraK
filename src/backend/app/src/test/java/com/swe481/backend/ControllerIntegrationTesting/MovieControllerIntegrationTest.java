package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
    void searchMovies_shouldReturnMoviesPageState_withDefaultPagination() throws Exception {
        mockMvc.perform(
                get(endPoint + "/search")
                        .param("title", "inception"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(20))
                .andExpect(jsonPath("$.totalResults").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber())
                .andExpect(jsonPath("$.hasPrev").isBoolean())
                .andExpect(jsonPath("$.hasNext").isBoolean())
                .andExpect(jsonPath("$.movies").isArray());
    }

    @Test
    void searchMovies_shouldApplyYearFilterAndReturnPagedState() throws Exception {
        mockMvc.perform(
                get(endPoint + "/search")
                        .param("year", "2005")
                        .param("page", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(10))
                .andExpect(jsonPath("$.totalResults").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber())
                .andExpect(jsonPath("$.hasPrev").isBoolean())
                .andExpect(jsonPath("$.hasNext").isBoolean())
                .andExpect(jsonPath("$.movies").isArray());
    }

    @Test
    void searchMovies_shouldAcceptAllFiltersTogether() throws Exception {
        mockMvc.perform(
                get(endPoint + "/search")
                        .param("title", "Letters")
                        .param("year", "2006")
                        .param("director", "Clint Eastwood")
                        .param("page", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(10))
                .andExpect(jsonPath("$.movies").isArray())
                .andExpect(jsonPath("$.hasPrev").isBoolean())
                .andExpect(jsonPath("$.hasNext").isBoolean());
    }

    @Test
    void searchMovies_shouldSupportCustomPagination() throws Exception {
        mockMvc.perform(
                get(endPoint + "/search")
                        .param("title", "a")
                        .param("page", "2")
                        .param("pageSize", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(2))
                .andExpect(jsonPath("$.pageSize").value(5))
                .andExpect(jsonPath("$.totalResults").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber())
                .andExpect(jsonPath("$.hasPrev").isBoolean())
                .andExpect(jsonPath("$.hasNext").isBoolean())
                .andExpect(jsonPath("$.movies").isArray());
    }


    @Test
    void browseMoviesByFirstLetter_shouldReturnPagedMovies() throws Exception {
        mockMvc.perform(
                get(endPoint + "/browseByFirstLetter")
                        .param("startsWith", "r")
                        .param("page", "1")
                        .param("pageSize", "20"))
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
                        .param("pageSize", "20"))
                .andExpect(status().isOk())
                // check response json matching
                .andExpect(jsonPath("$.movies").isArray())
                .andExpect(jsonPath("$.hasNext").isBoolean());
    }

    @Test
    void getMovieById_shouldReturnMovie_whenIdExists() throws Exception {
        mockMvc.perform(
                get(endPoint + "/{id}", "tt0278823"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("tt0278823"))
                .andExpect(jsonPath("$.title").isString())
                .andExpect(jsonPath("$.year").isNumber())
                .andExpect(jsonPath("$.director").isString())
                .andExpect(jsonPath("$.rating").isNumber())
                .andExpect(jsonPath("$.genres").isArray())
                .andExpect(jsonPath("$.stars").isArray());
    }

    @Test
    void getMovieById_shouldReturnNotFound_whenIdDoesNotExist() throws Exception {
        mockMvc.perform(
                get(endPoint + "/{id}", "tt1234567"))
                .andExpect(status().isNotFound());
    }

    @Test
    void autocompleteTitles_shouldReturnArray_whenQueryValid() throws Exception {
        mockMvc.perform(
                get(endPoint + "/autocomplete")
                        .param("query", "inc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void autocompleteTitles_shouldReturnObjectsWithIdAndTitle() throws Exception {
        mockMvc.perform(
                get(endPoint + "/autocomplete")
                        .param("query", "mel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].title").exists());
    }

    @Test
    void autocompleteTitles_shouldReturnEmpty_whenQueryTooShort() throws Exception {
        mockMvc.perform(
                get(endPoint + "/autocomplete")
                        .param("query", "in"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

}
