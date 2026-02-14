package com.swe481.backend.model.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    // What the frontend sends to login:
    // { "email": "...", "password": "..." }
    private String email;
    private String password;

}
