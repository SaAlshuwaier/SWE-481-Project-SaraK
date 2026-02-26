package com.swe481.backend.service.serviceInterface;

public interface CheckoutService {
    boolean validatePayment(String firstName, String lastName, String cardNumber, String expiration);
}
