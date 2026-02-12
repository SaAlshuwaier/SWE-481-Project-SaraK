package com.swe481.backend.service.serviceImp;

import com.swe481.backend.service.serviceInterface.CheckoutService;
import org.springframework.stereotype.Service;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    // Phase 2: dummy card only (DB validation will be implemented later)
    private static final String DUMMY_FIRST = "Jana";
    private static final String DUMMY_LAST = "Alshreef";
    private static final String DUMMY_CARD = "1211111111111111";
    private static final String DUMMY_EXP = "2030-12-31";

    @Override
    public boolean validatePayment(String firstName, String lastName, String cardNumber, String expiration) {
        return DUMMY_FIRST.equalsIgnoreCase(firstName)
                && DUMMY_LAST.equalsIgnoreCase(lastName)
                && DUMMY_CARD.equals(cardNumber)
                && DUMMY_EXP.equals(expiration);
    }
}
