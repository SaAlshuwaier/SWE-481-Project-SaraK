package com.swe481.backend.ServiceUnitTesting.serviceInterface;

public interface CheckoutService {
    boolean validatePayment(String firstName, String lastName, String cardNumber, String expiration);
}
