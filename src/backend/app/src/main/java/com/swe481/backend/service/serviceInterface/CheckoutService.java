package com.swe481.backend.service.serviceInterface;

import com.swe481.backend.Dto.CheckoutResult;

public interface CheckoutService {
    CheckoutResult processCheckout(String firstName, String lastName, String cardNumber, String expiration);
}