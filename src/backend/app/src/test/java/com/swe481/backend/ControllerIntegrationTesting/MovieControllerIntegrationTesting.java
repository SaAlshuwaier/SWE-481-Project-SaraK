package com.swe481.backend.ControllerIntegrationTesting;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration test for MovieController
 * Tests /api/movies endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class MovieControllerIntegrationTesting {

@Autowired
private MockMvc mockMvc;

private final String endPoint = "/api/movies";

@Test
void TestSearchMovies() throws Exception {
  mockMvc.perform(
          get(endPoint + "/search")
                  .param("title", "inception")
          )
          .andExpect(status().isOk());
        }

@Test
void TestBrowseMoviesByFirstLetter() throws Exception {
mockMvc.perform(
        get(endPoint + "/browseByFirstLetter")
                .param("startsWith", "r")
        )
        .andExpect(status().isOk());
}

@Test
void TestBrowseMoviesByGenre() throws Exception {
    mockMvc.perform(
            get(endPoint + "/browseByGenre")
                    .param("genreId", "28")
                    .param("page", "1")
                    .param("pageSize", "20")
            )
            .andExpect(status().isOk());
        }

@Test
void TestGetMovieById() throws Exception {
    mockMvc.perform(
            get(endPoint + "/{id}", "tt999")
            )
            .andExpect(status().isOk());
}
}