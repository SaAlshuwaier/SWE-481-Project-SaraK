package com.swe481.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swe481.backend.Dto.CheckoutModel;
import com.swe481.backend.Dto.CheckoutResult;
import com.swe481.backend.service.serviceInterface.CheckoutService;

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
            response.setMessage("First name, last name, card number, and expiration are required.");
            return ResponseEntity.badRequest().body(response);
        }

        CheckoutResult result = checkoutService.processCheckout(
                request.getFirstName(),
                request.getLastName(),
                request.getCardNumber(),
                request.getExpiration()
        );

        response.setSuccess(result.isSuccess());
        response.setMessage(result.getMessage());

        if (result.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return switch (result.getCode()) {
            case "EMPTY_CART", "INVALID_CARD", "CUSTOMER_NOT_FOUND", "INVALID_EXPIRATION" ->
                    ResponseEntity.badRequest().body(response);
            case "DATABASE_ERROR", "SYSTEM_ERROR" ->
                    ResponseEntity.internalServerError().body(response);
            default ->
                    ResponseEntity.badRequest().body(response);
        };
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}