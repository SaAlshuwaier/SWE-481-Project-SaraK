package com.swe481.backend.model.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * LoginResponse represents the response returned after login attempt.
 *
 * Example:
 * {
 *   "message": "Login successful",
 *   "success": true
 * }
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String message;
    private boolean success;
}
