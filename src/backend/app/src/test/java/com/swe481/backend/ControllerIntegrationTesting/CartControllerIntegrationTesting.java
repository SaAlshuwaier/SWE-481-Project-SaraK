package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

/**
 * Integration test for CartController (delete endpoint only)
*/
@SpringBootTest
@AutoConfigureMockMvc
class CartControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deleteItem() throws Exception {

        // Use a real movieId from our dataset
        String movieId = "tt0421974";

        MvcResult result = mockMvc.perform(
                delete("/api/cart/deleteItem/{movieId}", movieId)
        ).andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }
}