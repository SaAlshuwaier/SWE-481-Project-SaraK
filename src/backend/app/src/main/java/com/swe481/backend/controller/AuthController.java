package com.swe481.backend.controller;

import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.LogoutResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;
import com.swe481.backend.service.serviceInterface.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController
 *
 * Handles all authentication-related HTTP requests:
 * - session
 * - Login
 * - Logout
 * - Register
 */

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest credRequest,
            HttpServletRequest request) {

        // check if user exists
        LoginResponse response = authService.login(credRequest);

        if (!response.isSuccess()) {
            return ResponseEntity.status(401).body(response);
        }

        // create session, cookie (JSESSIONID) will be stored in browser automatically
        HttpSession session = request.getSession(true);

        // for backend services to use upon data query of the current user
        session.setAttribute("customerId", response.getCustomerId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
            return ResponseEntity.ok(new LogoutResponse("Logout successful", true));
        }

        return ResponseEntity.status(401)
                .body(new LogoutResponse("No active session", false));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
