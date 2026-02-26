package com.swe481.backend.ServiceUnitTesting.serviceImp;

import com.swe481.backend.ServiceUnitTesting.serviceInterface.CheckoutService;
import org.springframework.stereotype.Service;
/**
 * CheckoutServiceImpl is where the payment business logic will go later.
 */
@Service
public class CheckoutServiceImpl implements CheckoutService {
 /**
     * Validate checkout payment information
     *
     * Logic:
     * - Receives: firstName, lastName, cardNumber, expiration
     * - Phase 2 (Dummy):
     *     - Always returns true for testing
     *
     * @param firstName customer first name
     * @param lastName customer last name
     * @param cardNumber credit card number
     * @param expiration expiration date
     *
     * @return true if payment is valid, false otherwise
     */
    @Override
    public boolean validatePayment(String firstName, String lastName, String cardNumber, String expiration) {

        return true; // temporary dummy response for Phase 2 testing
    }
}
