package com.swe481.backend.controller;

import com.swe481.backend.model.CheckoutModel;
import com.swe481.backend.service.serviceInterface.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
/**
 * CheckoutController
 *
 * Handles all HTTP requests related to Checkout Payment.
 *
 * Base URL:
 *    /api/checkout
 *
 * Responsibilities:
 *    - Receive payment information from frontend
 *    - Validate required fields
 *    - Call CheckoutService to validate transaction
 *    - Return success or failure message
 *
 */
@RestController
@RequestMapping("/api")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutModel> checkout(@RequestBody CheckoutModel request) {
        CheckoutModel response = new CheckoutModel();

        if (request == null
                || isBlank(request.getFirstName())
                || isBlank(request.getLastName())
                || isBlank(request.getCardNumber())
                || isBlank(request.getExpiration())) {

            response.setSuccess(false);
            response.setMessage("firstName, lastName, cardNumber, and expiration are required");
            return ResponseEntity.badRequest().body(response);
        }

        boolean ok = checkoutService.validatePayment(
                request.getFirstName(),
                request.getLastName(),
                request.getCardNumber(),
                request.getExpiration()
        );

        if (ok) {
            response.setSuccess(true);
            response.setMessage("Transaction succeeded (mock)");
            return ResponseEntity.ok(response);
        }

        response.setSuccess(false);
        response.setMessage("Transaction failed: invalid payment info");
        return ResponseEntity.status(401).body(response);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
