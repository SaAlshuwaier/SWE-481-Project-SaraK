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
        MvcResult result = mockMvc.perform(
                get("/api/genres")
        ).andReturn();
        assertEquals(200, result.getResponse().getStatus());
    }
}
