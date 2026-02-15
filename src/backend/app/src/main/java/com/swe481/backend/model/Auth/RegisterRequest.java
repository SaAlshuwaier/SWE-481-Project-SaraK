package com.swe481.backend.model.Auth;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
/**
 * This is what the frontend will send when user creates an account.
 *
 * Example JSON:
 * {
 *   "firstName": "Loba",
 *   "lastName": "Yahya",
 *   "email": "Loba@email.com",
 *   "password": "1234",
 *   "address": "Riyadh",
 *   "ccId": "1111222233334444"
 * }
 */
public class RegisterRequest {
    private String firstName;
    private String lastName;

    private String email;
    private String password;

    private String address;

    private String ccId; // foreign key -> in phase 3 we must validate that it actually exists
}
