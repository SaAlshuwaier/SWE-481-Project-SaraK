package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.swe481.backend.model.Auth.LoginRequest;
import com.swe481.backend.model.Auth.LoginResponse;
import com.swe481.backend.model.Auth.LogoutResponse;
import com.swe481.backend.model.Auth.RegisterRequest;
import com.swe481.backend.model.Auth.RegisterResponse;
import com.swe481.backend.service.serviceImp.AuthServiceImpl;

/**
 * Unit tests for AuthServiceImpl methods.
 *
 * Current expected behavior:
 * - login(...) always returns success=true and message="Login successful"
 * - logout() always returns success=true and message="Logout successful"
 * - register(...) always returns success=true and message="User registered successfully"
 *
 */
public class AuthServiceImplUnitTest {

    private final AuthServiceImpl authService = new AuthServiceImpl();


    /** Tests that login(...) returns a LoginResponse with success=true and the correct message for a valid request.
     * 
     * Logic: Since the current implementation of login(...) does not perform any actual authentication logic, we can simply verify that it returns a LoginResponse with success=true and the expected message for any valid LoginRequest. We will create a LoginRequest with sample email and password values, call the login(...) method, and assert that the response is not null, has success=true, and contains the correct message.
     * Parammeters: email and password in LoginRequest.
     * Expected Output: A LoginResponse object with success=true and message="Login successful".
     * 
     */
    @Test
    void login_validRequest_returnsSuccessTrueAndCorrectMessage() {
        LoginRequest request = new LoginRequest("user@email.com", "123456");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertTrue(response.isSuccess());
    }



    /** Tests that logout() returns a LogoutResponse with success=true and the correct message.
     * 
     * Logic: Since the current implementation of logout() does not perform any actual logout logic, we can simply verify that it returns a LogoutResponse with success=true and the expected message. We will call the logout() method and assert that the response is not null, has success=true, and contains the correct message.
     * Parameters: None.
     * Expected Output: A LogoutResponse object with success=true and message="Logout successful".
     * 
     */
    @Test
    void logout_returnsSuccessTrueAndCorrectMessage() {
        LogoutResponse response = authService.logout();

        assertNotNull(response);
        assertEquals("Logout successful", response.getMessage());
        assertTrue(response.isSuccess());
    }


    /** Tests that register(...) returns a RegisterResponse with success=true and the correct message for a valid request.
     * 
     * Logic: Since the current implementation of register(...) does not perform any actual registration logic, we can simply verify that it returns a RegisterResponse with success=true and the expected message for any valid RegisterRequest. We will create a RegisterRequest with sample user details, call the register(...) method, and assert that the response is not null, has success=true, and contains the correct message.
     * Parameters: firstName, lastName, email, password, address, and ccId in RegisterRequest.
     * Expected Output: A RegisterResponse object with success=true and message="User registered successfully".
     * 
     */
    @Test
    void register_validRequest_returnsSuccessTrueAndCorrectMessage() {
        RegisterRequest request = new RegisterRequest(
                "Hailah",
                "Saad",
                "hailah@email.com",
                "1234",
                "Riyadh",
                "1234567890123456"
        );

        RegisterResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertTrue(response.isSuccess());
    }
}