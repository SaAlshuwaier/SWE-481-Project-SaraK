package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Integration tests for CheckoutController
 */
@SpringBootTest
@AutoConfigureMockMvc
class CheckoutControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void checkoutWhenMissingFields() throws Exception {

        // Only firstName is provided => should fail validation
        String requestJson = """
            { "firstName": "Neil" }
        """;

        MvcResult result = mockMvc.perform(
                post("/api/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        ).andReturn();

        // Expect 400 Bad Request
        assertEquals(400, result.getResponse().getStatus());
    }

    @Test
    void checkout_whenValidFields_shouldReturn200() throws Exception {

        // Valid request JSON with all required fields => should succeed 
        String requestJson = """
            {
              "firstName": "Neil",
              "lastName": "Kope",
              "cardNumber": "5232-4634-7322-2511",
              "expiration": "2008/12/01"
            }
        """;

        MvcResult result = mockMvc.perform(
                post("/api/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        ).andReturn();

        // With current dummy service returning true => should be 200 OK
        assertEquals(200, result.getResponse().getStatus());
    }
}