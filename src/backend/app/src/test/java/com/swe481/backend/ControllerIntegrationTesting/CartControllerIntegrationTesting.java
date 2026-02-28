package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

/**
 * Integration test for CartController (delete endpoint only)
*/
@SpringBootTest
@AutoConfigureMockMvc
class CartControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;

     // ─── getCart ───────────────────────────────────────────────

        @Test
        public void testGetCart_shouldReturn200() throws Exception {
                MvcResult result = mockMvc.perform(
                                get("/api/cart") // simulate GET /api/cart
                ).andReturn();

                // 1. CONNECTION - correct endpoint responded
                assertEquals(200, result.getResponse().getStatus());

                // 2. CONTENT TYPE - should return JSON
                String contentType = result.getResponse().getContentType();
                assertNotNull(contentType);
                assertTrue(contentType.contains("application/json"));

                // 3. RESPONSE KEYS - cart object must have these keys
                String body = result.getResponse().getContentAsString();
                assertNotNull(body);
                assertFalse(body.isEmpty());
                assertTrue(body.contains("\"items\""), "Response should have 'items' key");
                assertTrue(body.contains("\"totalPrice\""), "Response should have 'totalPrice' key");

                // 4. VALUES - items should be an array (starts with [)
                assertTrue(body.contains("\"items\":[") || body.contains("\"items\": ["),
                                "'items' should be an array");

                // 5. TYPES - totalPrice should be a number (no quotes around it)
                assertFalse(body.contains("\"totalPrice\":\""), "'totalPrice' must not be a string");
        }

        // ─── addItem ───────────────────────────────────────────────

        @Test
        public void testAddItem_shouldReturn200() throws Exception {
                String itemJson = """
                                {
                                    "movieId": "tt123",
                                    "title": "Inception",
                                    "quantity": 1
                                }
                                """; // JSON body to send

                MvcResult result = mockMvc.perform(
                                post("/api/cart/addItem") // simulate POST /api/cart/addItem
                                                .contentType(MediaType.APPLICATION_JSON) // tell server we're sending
                                                                                         // JSON
                                                .content(itemJson) // send the JSON body
                ).andReturn();

                // 1. CONNECTION - correct endpoint responded
                assertEquals(200, result.getResponse().getStatus());

                // 2. CONTENT TYPE - should return JSON
                String contentType = result.getResponse().getContentType();
                assertNotNull(contentType);
                assertTrue(contentType.contains("application/json"));

                // 3. RESPONSE KEYS - cart object keys
                String body = result.getResponse().getContentAsString();
                assertNotNull(body);
                assertFalse(body.isEmpty());
                assertTrue(body.contains("\"items\""), "Response should have 'items' key");
                assertTrue(body.contains("\"totalPrice\""), "Response should have 'totalPrice' key");

                // 3b. CART ITEM KEYS - each item must have these keys
                assertTrue(body.contains("\"movieId\""), "Cart item should have 'movieId' key");
                assertTrue(body.contains("\"title\""), "Cart item should have 'title' key");
                assertTrue(body.contains("\"quantity\""), "Cart item should have 'quantity' key");

                // 4. VALUES - the added item should appear in the response
                assertTrue(body.contains("\"tt123\""), "Cart should contain movieId 'tt123'");
                assertTrue(body.contains("\"Inception\""), "Cart should contain title 'Inception'");
                assertTrue(body.contains("\"quantity\":1") || body.contains("\"quantity\": 1"),
                                "Cart item quantity should be 1");

                // 5. TYPES - movieId and title should be strings (in quotes), quantity should
                // be a number (no quotes)
                assertTrue(body.contains("\"movieId\":\"") || body.contains("\"movieId\": \""),
                                "'movieId' must be a string");
                assertTrue(body.contains("\"title\":\"") || body.contains("\"title\": \""), "'title' must be a string");
                assertFalse(body.contains("\"quantity\":\""), "'quantity' must not be a string");
                assertFalse(body.contains("\"totalPrice\":\""), "'totalPrice' must not be a string");
        }

        // ─── updateItem ────────────────────────────────────────────

        @Test
        public void testUpdateItem_shouldReturn200() throws Exception {
                String updateJson = """
                                {
                                    "movieId": "tt123",
                                    "title": "Inception",
                                    "quantity": 3
                                }
                                """; // new quantity is 3

                MvcResult result = mockMvc.perform(
                                patch("/api/cart/updateItem/tt123") // simulate PATCH /api/cart/updateItem/tt123
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(updateJson))
                                .andReturn();

                // 1. CONNECTION - correct endpoint responded
                assertEquals(200, result.getResponse().getStatus());

                // 2. CONTENT TYPE - should return JSON
                String contentType = result.getResponse().getContentType();
                assertNotNull(contentType);
                assertTrue(contentType.contains("application/json"));

                // 3. RESPONSE KEYS - cart object keys
                String body = result.getResponse().getContentAsString();
                assertNotNull(body);
                assertFalse(body.isEmpty());
                assertTrue(body.contains("\"items\""), "Response should have 'items' key");
                assertTrue(body.contains("\"totalPrice\""), "Response should have 'totalPrice' key");

                // 3b. CART ITEM KEYS
                assertTrue(body.contains("\"movieId\""), "Cart item should have 'movieId' key");
                assertTrue(body.contains("\"title\""), "Cart item should have 'title' key");
                assertTrue(body.contains("\"quantity\""), "Cart item should have 'quantity' key");

                // 4. VALUES - quantity should now be updated to 3
                assertTrue(body.contains("\"quantity\":3") || body.contains("\"quantity\": 3"),
                                "Cart item quantity should be updated to 3");

                // 5. TYPES - movieId and title are strings, quantity and totalPrice are
                // numbers
                assertTrue(body.contains("\"movieId\":\"") || body.contains("\"movieId\": \""),
                                "'movieId' must be a string");
                assertTrue(body.contains("\"title\":\"") || body.contains("\"title\": \""), "'title' must be a string");
                assertFalse(body.contains("\"quantity\":\""), "'quantity' must not be a string");
                assertFalse(body.contains("\"totalPrice\":\""), "'totalPrice' must not be a string");
        }

        @Test
        public void testUpdateItem_withZeroQuantity_shouldReturn200() throws Exception {
                String updateJson = """
                                {
                                    "movieId": "tt123",
                                    "title": "Inception",
                                    "quantity": 0
                                }
                                """; // quantity 0 means remove later

                MvcResult result = mockMvc.perform(
                                patch("/api/cart/updateItem/tt123")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(updateJson))
                                .andReturn();

                // 1. CONNECTION - correct endpoint responded
                assertEquals(200, result.getResponse().getStatus());

                // 2. CONTENT TYPE - should return JSON
                String contentType = result.getResponse().getContentType();
                assertNotNull(contentType);
                assertTrue(contentType.contains("application/json"));

                // 3. RESPONSE KEYS - cart object keys
                String body = result.getResponse().getContentAsString();
                assertNotNull(body);
                assertFalse(body.isEmpty());
                assertTrue(body.contains("\"items\""), "Response should have 'items' key");
                assertTrue(body.contains("\"totalPrice\""), "Response should have 'totalPrice' key");

                // 4. VALUES - quantity 0 should be reflected
                assertTrue(body.contains("\"quantity\":0") || body.contains("\"quantity\": 0"),
                                "Cart item quantity should be 0");

                // 5. TYPES - quantity and totalPrice must be numbers not strings
                assertFalse(body.contains("\"quantity\":\""), "'quantity' must not be a string");
                assertFalse(body.contains("\"totalPrice\":\""), "'totalPrice' must not be a string");
        }


    @Test
    void deleteItem() throws Exception {

        // Use a real movieId from our dataset
            String movieId = "tt0421974";

            mockMvc.perform(
                    delete("/api/cart/deleteItem/{movieId}", movieId)
            )
            // 1. CONNECTION
            .andExpect(status().isOk())

            // 2. CONTENT TYPE
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))

            // 3. ROOT KEYS
            .andExpect(jsonPath("$.items").exists())
            .andExpect(jsonPath("$.totalQuantity").exists())

            // 4. TYPES
            .andExpect(jsonPath("$.items").isArray())
            .andExpect(jsonPath("$.totalQuantity").isNumber());
    }
}