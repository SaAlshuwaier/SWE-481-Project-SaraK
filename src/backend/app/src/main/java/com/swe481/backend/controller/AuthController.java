package com.swe481.backend.ControllerIntegrationTesting;

import com.swe481.backend.model.Auth.LoginRequest;
import com.swe481.backend.model.Auth.LoginResponse;
import com.swe481.backend.model.Auth.LogoutResponse;
import com.swe481.backend.model.Auth.RegisterRequest;
import com.swe481.backend.model.Auth.RegisterResponse;
import com.swe481.backend.ServiceUnitTesting.serviceInterface.AuthService;
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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request)); 
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

}


