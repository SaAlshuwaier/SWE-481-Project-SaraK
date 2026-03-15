package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.jooq.DSLContext;
import org.junit.jupiter.api.Test;
import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;
import com.swe481.backend.service.serviceImp.AuthServiceImpl;

/**
 * Unit tests for AuthServiceImpl methods.
 * 
 */
public class AuthServiceImplUnitTest {

    private DSLContext dls;
    private final AuthServiceImpl authService = new AuthServiceImpl(dls);

    /**
     * Tests the behavior of login(...) under different input conditions.
     *
     * Logic:
     * These tests verify that the login method returns the correct
     * LoginResponse depending on the validity of the provided credentials.
     *
     * The tested scenarios include:
     * - Valid credentials → login succeeds.
     * - Missing or empty input → validation error is returned.
     * - wrong email and passowrd → login fails.
     * - correct email wrong password → login fails.
     * - wrong email correct password  → login fails.
     *
     * Parameters:
     * - Email and password provided in LoginRequest.
     *
     * Expected Output:
     * - A LoginResponse object indicating whether the login attempt
     * succeeded or failed, along with the appropriate message.
     */
    @Test
    void login_validRequest_returnsSuccessTrueAndCorrectMessage() {
        LoginRequest request = new LoginRequest("user@email.com", "123456");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertTrue(response.isSuccess());
    }

    @Test
    void login_emptyEmailOrPassword_returnsFailure() {

        LoginRequest request = new LoginRequest("", "");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Email and password required", response.getMessage());
    }

    @Test
    void login_invalidCredentials_returnsFailure() {

        LoginRequest request = new LoginRequest("wrong@email.com", "wrong");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
    }

    @Test
    void login_validEmailWrongPassword_returnsFailure() {

        LoginRequest request = new LoginRequest("Parker234@aol.com", "wrongPassword");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
    }

    @Test
    void login_wrongEmailValidPassword_returnsFailure() {

        LoginRequest request = new LoginRequest("wrong@email.com", "test");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
    }

    /**
     * Tests that register(...) returns a RegisterResponse with success=true and the
     * correct message for a valid request.
     * 
     * Logic: Since the current implementation of register(...) does not perform any
     * actual registration logic, we can simply verify that it returns a
     * RegisterResponse with success=true and the expected message for any valid
     * RegisterRequest. We will create a RegisterRequest with sample user details,
     * call the register(...) method, and assert that the response is not null, has
     * success=true, and contains the correct message.
     * Parameters: firstName, lastName, email, password, address, and ccId in
     * RegisterRequest.
     * Expected Output: A RegisterResponse object with success=true and
     * message="User registered successfully".
     * 
     */
    @Test
    void register_validRequest_returnsSuccessTrueAndCorrectMessage() {
        RegisterRequest request = new RegisterRequest(
                "Hailah",
                "Saad",
                "hailah@email.com",
                "1234",
                "",
                "");

        RegisterResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertTrue(response.isSuccess());
    }

    @Test
    void register_withEmptyEmail_shouldReturnFailure() {
        RegisterRequest request = new RegisterRequest(
                "Hailah",
                "Saad",
                "", // ← email empty
                "1234",
                "",
                "");

        RegisterResponse response = authService.register(request);

        // Expect failure (logic not yet implemented, so this will FAIL)
        assertFalse(response.isSuccess());
    }
}