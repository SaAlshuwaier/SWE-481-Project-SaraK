package com.swe481.backend.Dto.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * LoginRequest represents the data sent from frontend when user logs in.
 *
 * Example :
 * {
 *   "email": "user@email.com",
 *   "password": "123456"
 * }
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
