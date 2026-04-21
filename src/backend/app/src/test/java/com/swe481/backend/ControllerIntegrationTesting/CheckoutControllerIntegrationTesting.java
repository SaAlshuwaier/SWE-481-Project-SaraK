package com.swe481.backend.ControllerIntegrationTesting;

import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
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

    // old test without login step, which causes checkout to fail because the service checks that the card's customer ID matches the logged-in user
    /* 
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
    }  */


        // I added login step to the above test to set the customerId in session, which is required for checkout to succeed
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

            mockMvc.perform(
                    post("/api/auth/login")
                            .session(session)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                {
                                "email": "cc@msn.com",
                                "password": "1111"
                                }
                            """)
            ).andExpect(status().isOk());

            String checkoutJson = """
                {
                "firstName": "Chris",
                "lastName": "Carr",
                "cardNumber": "755003",
                "expiration": "2007-01-01"
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

        // new test to verify that the card's customer ID matches the logged-in user
        @Test
        void checkoutWhenCardBelongsToDifferentLoggedInUserShouldReturn400() throws Exception {
            MockHttpSession session = new MockHttpSession();

            mockMvc.perform(
                    post("/api/auth/login")
                            .session(session)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                {
                                "email": "cc@msn.com",
                                "password": "1111"
                                }
                            """)
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
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("The card information does not match our records."));
        }
}