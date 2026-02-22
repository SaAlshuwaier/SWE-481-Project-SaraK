package com.swe481.backend;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.swe481.backend.service.serviceImp.CheckoutServiceImpl;

/**
 * Unit tests for CheckoutServiceImpl.validatePayment(...)
 *
 * Expected behavior (final implementation):
 * - Required fields: firstName, lastName, cardNumber, expiration
 * 
*/
public class CheckoutServiceImplUnitTest {

    private final CheckoutServiceImpl checkoutService = new CheckoutServiceImpl();

    @Test
    void validatePaymentWithValidDetails() {
        boolean result = checkoutService.validatePayment(
                "Neil", "Kope", "5232-4634-7322-2511", "2008/12/01"
        );
        assertTrue(result);
    
    }

    @Test
    void validatePaymentWithInvalidCardNumber() {
    boolean result = checkoutService.validatePayment(
            "Neil", "Kope", "0000-0000-0000-0000", "2008/12/01"
    );
    assertFalse(result);
    }

    @Test
    void validatePaymentWithEmptyCardNumber() {
    boolean result = checkoutService.validatePayment(
            "Neil", "Kope", "", "2008/12/01"
    );
    assertFalse(result);
    }

    @Test
    void validatePaymentWithInvalidExpirationCard() {
        boolean result = checkoutService.validatePayment(
                "Neil", "Kope", "5232-4634-7322-2511", "2000/01/01"
        );
        assertFalse(result);
    }

    @Test
    void validatePaymentWithEmptyExpirationCard() {
        boolean result = checkoutService.validatePayment(
                "Neil", "Kope", "5232-4634-7322-2511", ""
        );
        assertFalse(result);
    }

    @Test
    void validatePaymentWithInvalidFirstName() {
        boolean result = checkoutService.validatePayment(
                "Loba", "Kope", "5232-4634-7322-2511", "2008/12/01"
        );
        assertFalse(result);
    }

     @Test
    void validatePaymentWithEmptyFirstName() {
        boolean result = checkoutService.validatePayment(
                "", "Kope", "5232-4634-7322-2511", "2008/12/01"
        );
        assertFalse(result);
    }

     @Test
    void validatePaymentWithInvalidLastName() {
        boolean result = checkoutService.validatePayment(
                "Neil", "Alyahya", "5232-4634-7322-2511", "2008/12/01"
        );
        assertFalse(result);
    }

     @Test
    void validatePaymentWithEmptyLastName() {
        boolean result = checkoutService.validatePayment(
                "Neil", "", "5232-4634-7322-2511", "2008/12/01"
        );
        assertFalse(result);
    }

    @Test
    void validatePaymentWithNullFields() {
    boolean result = checkoutService.validatePayment(
            null, null, null, null
    );
    assertFalse(result);
}
} 