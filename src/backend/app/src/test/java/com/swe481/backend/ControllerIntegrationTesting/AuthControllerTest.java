package com.swe481.backend.ControllerIntegrationTesting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * Integration tests for AuthController endpoints.
 * Uses SpringBootTest + MockMvc
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void login_returns200() throws Exception {

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                    {
                                      "email": "Parker234@aol.com",
                                      "password": "test"
                                    }
                                """))

                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.success").isBoolean());
    }

    @Test
    void logout_returns401() throws Exception {

        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void session_withSession_returns200() throws Exception {

        mockMvc.perform(get("/api/auth/session")
                .sessionAttr("user", "testUser"))
                .andExpect(status().isOk());
    }

    /**
     * Tests that the /api/auth/register endpoint returns a 200 OK status for a
     * valid registration request.
     * 
     * Logic: We will create a valid JSON request body containing user registration
     * details (firstName, lastName, email, password, address, and ccId), perform a
     * POST request to the /api/auth/register endpoint using MockMvc, and assert
     * that the response status is 200 OK. This verifies that the registration
     * endpoint is correctly set up to handle registration requests and returns the
     * expected status code for valid input.
     * Parameters: firstName, lastName, email, password, address, and ccId
     * Expected Output: HTTP status code 200 OK.
     * 
     */
    @Test
    void register_returns200() throws Exception {

        String jsonBody = """
                    {
                      "firstName": "Hailah",
                      "lastName": "Saad",
                      "email": "hailah@email.com",
                      "password": "1234",
                      "address": "Riyadh",
                      "ccId": "1234567890123456"
                    }
                """;

        MvcResult result = mockMvc.perform(
                post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(jsonBody))
                .andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }
}