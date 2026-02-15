package com.swe481.backend.controller;

import com.swe481.backend.model.Auth.LoginRequest;
import com.swe481.backend.model.Auth.LoginResponse;
import com.swe481.backend.model.Auth.LogoutResponse;
import com.swe481.backend.model.Auth.RegisterRequest;
import com.swe481.backend.model.Auth.RegisterResponse;
import com.swe481.backend.service.serviceInterface.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController
 *
 * Handles all authentication-related HTTP requests:
 *  - Login
 *  - Logout
 *  - Register
 */

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     *
     * Description:
     *    Authenticates a user using email and password.
     *
     * Logic:
     *    - Receive LoginRequest from frontend
     *    - Pass request to service layer
     *    - Service validates credentials
     *    - If valid -> return success message
     *    - If invalid -> return failure message
     *
     * Accepts:
     * {
     *    "email": "user@email.com",
     *    "password": "123456"
     * }
     *
     * Returns:
     * {
     *    "message": "Login successful"
     *    "success": true
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request)); 
    }

       /**
     * POST /api/auth/logout
     *
     * Description:
     *    Ends the current user session.
     *
     * Accepts:
     *    Nothing
     *
     * Returns:
     * {
     *    "success": true,
     *    "message": "Logged out successfully"
     * }
     */
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }

    /**
     * POST /api/auth/register
     *
     * Description:
     *    Creates a new customer account.
     *
     * Accepts JSON:
     * {
     *    "firstName": "Loba",
     *    "lastName": "Alyahya",
     *    "email": "loba@email.com",
     *    "password": "1234",
     *    "address": "Riyadh",
     *    "ccId": "1234567890123456"
     * }
     *
     * Logic:
     *    - Pass request to service
     *    - Service will later insert into database 
     *
     * Returns:
     * {
     *    "success": true,
     *    "message": "Account created successfully"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

}


