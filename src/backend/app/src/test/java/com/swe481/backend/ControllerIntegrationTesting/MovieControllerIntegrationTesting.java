package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 * Integration test for MovieController
 * Tests GET /api/movies/{id}
 */
@SpringBootTest
@AutoConfigureMockMvc
class MovieControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getMovieById_shouldReturn200() throws Exception {

        // Using a dummy id, service currently returns a Movie object even if id is random
        String movieId = "tt999";

        MvcResult result = mockMvc.perform(
                get("/api/movies/{id}", movieId)
        ).andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }

    @Test
    void getMovieById_withDifferentId_shouldStillReturn200ForNow() throws Exception {

        // Since getMovieById currently returns a dummy movie for any id
        String movieId = "tt1234567";

        MvcResult result = mockMvc.perform(
                get("/api/movies/{id}", movieId)
        ).andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }
}