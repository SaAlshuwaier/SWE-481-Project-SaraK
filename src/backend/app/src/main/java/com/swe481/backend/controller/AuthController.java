package com.swe481.backend.controller;

import com.swe481.backend.model.AuthModel;
import com.swe481.backend.service.serviceInterface.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthModel> login(@RequestBody AuthModel request) {
        AuthModel response = new AuthModel();

        if (request == null || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            response.setMessage("Email and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        if (authService.authenticate(request.getEmail(), request.getPassword())) {
            response.setMessage("Login successful");
            return ResponseEntity.ok(response);
        }

        response.setMessage("Invalid email or password");
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<AuthModel> logout() {
        AuthModel response = new AuthModel();
        response.setMessage("Logged out");
        return ResponseEntity.ok(response);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
