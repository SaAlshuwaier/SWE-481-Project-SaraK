package com.swe481.backend.model.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * LogoutResponse represents the response returned after logout.
 *
 * Example JSON:
 * {
 *   "message": "Logout successful",
 *   "success": true
 * }
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogoutResponse {
    private String message;
    private boolean success;

}
