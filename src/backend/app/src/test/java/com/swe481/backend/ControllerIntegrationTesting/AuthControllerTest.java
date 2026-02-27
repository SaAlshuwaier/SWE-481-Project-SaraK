package com.swe481.backend.ControllerIntegrationTesting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Integration tests for AuthController endpoints.
 * Uses SpringBootTest + MockMvc (same structure as team).
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;


    /** Tests that the /api/auth/login endpoint returns a 200 OK status for a valid login request.
     * 
     * Logic: We will create a valid JSON request body containing an email and password, perform a POST request to the /api/auth/login endpoint using MockMvc, and assert that the response status is 200 OK. This verifies that the endpoint is correctly set up to handle login requests and returns the expected status code for valid input.
     * Parameters: email and password in the JSON request body.
     * Expected Output: HTTP status code 200 OK.
     * 
     */
    @Test
    void login_returns200() throws Exception {

        String jsonBody = """
            {
              "email": "user@email.com",
              "password": "123456"
            }
        """;

        MvcResult result = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(jsonBody)
        ).andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }


    /** Tests that the /api/auth/logout endpoint returns a 200 OK status.
     * 
     * Logic: We will perform a POST request to the /api/auth/logout endpoint using MockMvc without any request body (since logout does not require input), and assert that the response status is 200 OK. This verifies that the logout endpoint is correctly set up and returns the expected status code when accessed.
     * Parameters: None.
     * Expected Output: HTTP status code 200 OK.
     * 
     */
    @Test
    void logout_returns200() throws Exception {

        MvcResult result = mockMvc.perform(
                post("/api/auth/logout")
        ).andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }

    /** Tests that the /api/auth/register endpoint returns a 200 OK status for a valid registration request.
     * 
     * Logic: We will create a valid JSON request body containing user registration details (firstName, lastName, email, password, address, and ccId), perform a POST request to the /api/auth/register endpoint using MockMvc, and assert that the response status is 200 OK. This verifies that the registration endpoint is correctly set up to handle registration requests and returns the expected status code for valid input.
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
                        .content(jsonBody)
        ).andReturn();

        assertEquals(200, result.getResponse().getStatus());
    }
}