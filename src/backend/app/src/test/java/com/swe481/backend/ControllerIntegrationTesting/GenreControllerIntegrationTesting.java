package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Integration test for GenreController
 * Tests the /api/genres endpoint.
 */
@SpringBootTest            
@AutoConfigureMockMvc 
public class GenreControllerIntegrationTesting {
    @Autowired
    private MockMvc mockMvc;  // Tool to perform fake HTTP requests against our controllers

    @Test
    void getAllGenres() throws Exception {
        mockMvc.perform(
                get("/api/genres")
        ).andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[0].id").isNumber())
        .andExpect(jsonPath("$[0].name").isString());
    }
}
