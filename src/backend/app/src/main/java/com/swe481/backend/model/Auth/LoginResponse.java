package com.swe481.backend.model.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
        // What backend returns to frontend:
    // { "message": "Login successful", "success": true }
    private String message;
    private boolean success;
}
