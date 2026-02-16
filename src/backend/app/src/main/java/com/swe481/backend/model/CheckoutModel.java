package com.swe481.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * CheckoutModel represents the checkout payment request and response.
 *
 * Request Fields:
 *  - firstName
 *  - lastName
 *  - cardNumber
 *  - expiration
 *
 * Response Fields:
 *  - success
 *  - message
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutModel {
    // request fields
    private String firstName;
    private String lastName;
    private String cardNumber;
    private String expiration; 

    // response fields
    private Boolean success;
    private String message;
}
