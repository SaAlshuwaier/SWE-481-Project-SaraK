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
 * This is what the frontend will send when user creates an account.
 *
 * Example JSON:
 * {
 *   "firstName": "Loba",
 *   "lastName": "Yahya",
 *   "email": "Loba@email.com",
 *   "password": "1234",
 *   "address": "Riyadh",
 *   "ccNumber": "1111222233334444",
 *   "ccExpiration": "2026-01-01",
 *   "ccFirstName": "Loba",
 *   "ccLastName": "Yahya"
 * }
 */
public class RegisterRequest {
    private String firstName;
    private String lastName;

    private String email;
    private String password;

    private String address;

// Credit card fields (name on card may differ from account holder)
    private String ccNumber;
    private String ccExpiration;   // format: "yyyy-MM-dd"
    private String ccFirstName;
    private String ccLastName;}
