package com.swe481.backend.service.serviceImp;

import com.swe481.backend.service.serviceInterface.CheckoutService;
import org.springframework.stereotype.Service;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Override
    public boolean validatePayment(String firstName, String lastName, String cardNumber, String expiration) {

        // TODO (Phase 3):
        // 1) Validate payment info against creditcards table (NOT customers table)
        // 2) If valid, insert into sales table and return success
        // 3) Add proper error handling + security (never log card numbers)

        return true; // temporary dummy response for Phase 2 testing
    }
}
