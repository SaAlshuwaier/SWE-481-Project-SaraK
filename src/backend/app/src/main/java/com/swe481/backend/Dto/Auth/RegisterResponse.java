package com.swe481.backend.Dto.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
/**
 * Create Account response.
 *
 * Example:
 * {
 *   "message": "Account created successfully",
 *   "customerId": 12,
 *   "success": true
 * }
 *
 */
public class RegisterResponse {
    private String message;
    private Integer customerId;
    private boolean success;
}
