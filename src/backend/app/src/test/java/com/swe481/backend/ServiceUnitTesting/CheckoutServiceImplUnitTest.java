package com.swe481.backend.ServiceUnitTesting;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.CheckoutResult;
import com.swe481.backend.Dto.Repo.CheckoutRepository;
import com.swe481.backend.service.serviceImp.CheckoutServiceImpl;

import jakarta.servlet.http.HttpSession;

@ExtendWith(MockitoExtension.class)
public class CheckoutServiceImplUnitTest {

    @Mock
    private CheckoutRepository checkoutRepository;

    @Mock
    private HttpSession httpSession;

    private CheckoutServiceImpl checkoutService;

    @BeforeEach
    void setUp() {
        checkoutService = new CheckoutServiceImpl(checkoutRepository, httpSession);
    }

    @Test
    void processCheckoutShouldReturnInvalidCardWhenCardDoesNotMatchDatabase() {
        when(checkoutRepository.isValidCreditCard(
                eq("Janet"),
                eq("Trink"),
                eq("1354895485215896548"),
                eq(LocalDate.of(2004, 3, 25)))).thenReturn(false);

        CheckoutResult result = checkoutService.processCheckout(
                "Janet",
                "Trink",
                "1354895485215896548",
                "2004-03-25");

        assertFalse(result.isSuccess());
        assertEquals("INVALID_CARD", result.getCode());
        assertEquals("The card information does not match our records.", result.getMessage());
    }

    @Test
    void processCheckoutShouldReturnCustomerNotFoundWhenCardExistsButCustomerIsMissing() {
        when(checkoutRepository.isValidCreditCard(any(), any(), any(), any())).thenReturn(true);
        when(checkoutRepository.findCustomerId("Janet", "Trink", "1354895485215896548")).thenReturn(null);

        CheckoutResult result = checkoutService.processCheckout(
                "Janet",
                "Trink",
                "1354895485215896548",
                "2004-03-25");

        assertFalse(result.isSuccess());
        assertEquals("CUSTOMER_NOT_FOUND", result.getCode());
        assertEquals("No customer account is linked to this card.", result.getMessage());
    }

    /*
     * removed since Dr. bushra said all cards in the database are valid and we
     * don't need to check if the card belongs to the logged-in user
     * // new test to verify that the card's customer ID matches the logged-in user
     * 
     * @Test
     * void
     * processCheckoutShouldReturnInvalidCardWhenCardBelongsToDifferentLoggedInUser(
     * ) {
     * when(checkoutRepository.isValidCreditCard(any(), any(), any(),
     * any())).thenReturn(true);
     * when(checkoutRepository.findCustomerId("Janet", "Trink",
     * "1354895485215896548")).thenReturn(135002);
     * when(httpSession.getAttribute("customerId")).thenReturn(755003);
     * 
     * CheckoutResult result = checkoutService.processCheckout(
     * "Janet",
     * "Trink",
     * "1354895485215896548",
     * "2004-03-25"
     * );
     * 
     * assertFalse(result.isSuccess());
     * assertEquals("INVALID_CARD", result.getCode());
     * assertEquals("The card information does not match our records.",
     * result.getMessage());
     * }
     */

    @Test
    void processCheckoutShouldReturnEmptyCartWhenCartSessionIsMissing() {
        when(checkoutRepository.isValidCreditCard(any(), any(), any(), any())).thenReturn(true);
        when(checkoutRepository.findCustomerId("Janet", "Trink", "1354895485215896548")).thenReturn(1);
        // when(httpSession.getAttribute("customerId")).thenReturn(1); // Simulate
        // logged-in user with ID 1 -- Removed since Dr. bushra said all cards in the
        // database are valid and we don't need to check if the card belongs to the
        // logged-in user
        when(httpSession.getAttribute("cart")).thenReturn(null);

        CheckoutResult result = checkoutService.processCheckout(
                "Janet",
                "Trink",
                "1354895485215896548",
                "2004-03-25");

        assertFalse(result.isSuccess());
        assertEquals("EMPTY_CART", result.getCode());
        assertEquals("Your cart is empty.", result.getMessage());
    }

    @Test
    void processCheckoutShouldSucceedAndInsertSalesWhenEverythingIsValid() {
        Cart.CartItem item = new Cart.CartItem("tt0461892", "15", 2);
        Cart cart = new Cart(new ArrayList<>(List.of(item)), 2);

        when(checkoutRepository.isValidCreditCard(any(), any(), any(), any())).thenReturn(true);
        when(checkoutRepository.findCustomerId("Janet", "Trink", "1354895485215896548")).thenReturn(1);
        // when(httpSession.getAttribute("customerId")).thenReturn(1); // Simulate
        // logged-in user with ID 1 -- Removed since Dr. bushra said all cards in the
        // database are valid and we don't need to check if the card belongs to the
        // logged-in user
        when(httpSession.getAttribute("cart")).thenReturn(cart);

        CheckoutResult result = checkoutService.processCheckout(
                "Janet",
                "Trink",
                "1354895485215896548",
                "2004-03-25");

        assertTrue(result.isSuccess());
        assertEquals("SUCCESS", result.getCode());
        assertEquals("Payment completed successfully.", result.getMessage());

        verify(checkoutRepository, times(2))
                .insertSale(eq(1), eq("tt0461892"), any(LocalDate.class));

        verify(httpSession).removeAttribute("cart");
    }
}