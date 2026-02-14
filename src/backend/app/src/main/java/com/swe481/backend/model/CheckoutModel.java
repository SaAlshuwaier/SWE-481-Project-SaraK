package com.swe481.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
