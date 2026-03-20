package com.swe481.backend.ControllerIntegrationTesting;

import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CheckoutControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DSLContext dsl;

    @BeforeEach
    void syncSalesSequence() {
        dsl.execute("""
            SELECT setval(
              pg_get_serial_sequence('sales', 'id'),
              COALESCE((SELECT MAX(id) FROM sales), 1),
              true
            )
        """);
    }

    @Test
    void checkoutWhenMissingFieldsShouldReturn400() throws Exception {
        String requestJson = """
            { "firstName": "Janet" }
        """;

        mockMvc.perform(
                post("/api/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("First name, last name, card number, and expiration are required."));
    }

    @Test
    void checkoutWhenInvalidCardShouldReturn400() throws Exception {
        String requestJson = """
            {
              "firstName": "Wrong",
              "lastName": "User",
              "cardNumber": "0000000000000000",
              "expiration": "2004-03-25"
            }
        """;

        mockMvc.perform(
                post("/api/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("The card information does not match our records."));
    }

    @Test
    void checkoutWhenValidDataAndCartExistsShouldReturn200() throws Exception {
        MockHttpSession session = new MockHttpSession();

        String addToCartJson = """
            {
              "movieId": "tt0461892",
              "title": "15",
              "quantity": 1
            }
        """;

        mockMvc.perform(
                post("/api/cart/addItem")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(addToCartJson)
        ).andExpect(status().isOk());

        String checkoutJson = """
            {
              "firstName": "Janet",
              "lastName": "Trink",
              "cardNumber": "1354895485215896548",
              "expiration": "2004-03-25"
            }
        """;

        mockMvc.perform(
                post("/api/checkout")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutJson)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Payment completed successfully."));
    }
}