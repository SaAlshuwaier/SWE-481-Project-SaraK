package com.swe481.backend.ControllerIntegrationTesting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

@SpringBootTest
@AutoConfigureMockMvc
class CartControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;
    private MockHttpSession session;

        @BeforeEach
        public void setup() throws Exception {
        session = new MockHttpSession();

        String addJson = """
                {
                        "movieId": "tt123",
                        "title": "Inception",
                        "quantity": 1
                }
                """;

        mockMvc.perform(post("/api/cart/addItem")
                .contentType(MediaType.APPLICATION_JSON)
                .content(addJson)
                .session(session))
                .andExpect(status().isOk());
        }

        //Helper
        private RequestPostProcessor withSession() {
        return request -> {
                request.setSession(session);
                return request;
        };
        }

    // ─── getCart ───────────────────────────────────────────────

    @Test
    public void testGetCart_shouldReturn200() throws Exception {
        mockMvc.perform(
                get("/api/cart")
                .with(withSession())) 

                // 1. CONNECTION
                .andExpect(status().isOk())

                // 2. CONTENT TYPE
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))

                // 3. RESPONSE KEYS
                .andExpect(jsonPath("$.items").exists())
                .andExpect(jsonPath("$.totalQuantity").exists())

                // 4. TYPES
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.totalQuantity").isNumber());    }

    // ─── addItem ───────────────────────────────────────────────

    @Test
    public void testAddItem_shouldReturn200() throws Exception {
        String itemJson = """
                {
                    "movieId": "tt1234", 
                    "title": "Sky Fighters",
                    "quantity": 1
                }
                """; 

        mockMvc.perform(
                post("/api/cart/addItem")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemJson)
                        .with(withSession()))
                // 1. CONNECTION
                .andExpect(status().isOk())

                // 2. CONTENT TYPE
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))

                // 3. ROOT KEYS
                .andExpect(jsonPath("$.items").exists())
                .andExpect(jsonPath("$.totalQuantity").exists())

                // 3b. CART ITEM KEYS
                .andExpect(jsonPath("$.items[1].movieId").exists())
                .andExpect(jsonPath("$.items[1].title").exists())
                .andExpect(jsonPath("$.items[1].quantity").exists())

                // 4. VALUES 
                .andExpect(jsonPath("$.items[1].movieId").value("tt1234"))
                .andExpect(jsonPath("$.items[1].title").value("Sky Fighters"))
                .andExpect(jsonPath("$.items[1].quantity").value(1))

                // 5. TYPES
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.totalQuantity").isNumber())
                .andExpect(jsonPath("$.items[1].quantity").isNumber());    }


    // ─── updateItem ────────────────────────────────────────────

    @Test
    public void testUpdateItem_shouldReturn200() throws Exception {
        String updateJson = """
                {
                    "movieId": "tt123",
                    "title": "Inception",
                    "quantity": 3
                }
                """;

        mockMvc.perform(
                patch("/api/cart/updateItem/tt123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson)
                        .with(withSession()))
                // 1. CONNECTION
                .andExpect(status().isOk())

                // 2. CONTENT TYPE
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))

                // 3. ROOT KEYS
                .andExpect(jsonPath("$.items").exists())
                .andExpect(jsonPath("$.totalQuantity").exists())

                // 3b. CART ITEM KEYS
                .andExpect(jsonPath("$.items[0].movieId").exists())
                .andExpect(jsonPath("$.items[0].title").exists())
                .andExpect(jsonPath("$.items[0].quantity").exists())

                // 4. VALUES - quantity updated to 3
                .andExpect(jsonPath("$.items[0].quantity").value(3))
                .andExpect(jsonPath("$.items[0].movieId").value("tt123"))
                .andExpect(jsonPath("$.items[0].title").value("Inception"))

                // 5. TYPES
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.totalQuantity").isNumber())
                .andExpect(jsonPath("$.items[0].quantity").isNumber());    }

    @Test
    public void testUpdateItem_withZeroQuantity_shouldReturn200() throws Exception {
        String updateJson = """
                {
                    "movieId": "tt123",
                    "title": "Inception",
                    "quantity": 0
                }
                """;

        mockMvc.perform(
                patch("/api/cart/updateItem/tt123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson)
                        .with(withSession()))
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

    // ─── deleteItem ────────────────────────────────────────────

    @Test
    void deleteItem() throws Exception {
        String movieId = "tt0421974";

        mockMvc.perform(
                delete("/api/cart/deleteItem/{movieId}", movieId)
                        .with(withSession()))
                // 1. CONNECTION
                .andExpect(status().isOk())

                // 2. CONTENT TYPE
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))

                // 3. ROOT KEYS
                .andExpect(jsonPath("$.items").exists())
                .andExpect(jsonPath("$.totalQuantity").exists())

                // 4. TYPES
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.totalQuantity").isNumber());    }
}