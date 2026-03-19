package com.swe481.backend.service.serviceImp;

import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.Cart.CartItem;
import com.swe481.backend.Dto.CheckoutResult;
import com.swe481.backend.Dto.Repo.CheckoutRepository;
import com.swe481.backend.service.serviceInterface.CheckoutService;
import jakarta.servlet.http.HttpSession;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private static final String CART_SESSION_KEY = "cart";

    private final CheckoutRepository checkoutRepository;
    private final HttpSession httpSession;

    public CheckoutServiceImpl(CheckoutRepository checkoutRepository, HttpSession httpSession) {
        this.checkoutRepository = checkoutRepository;
        this.httpSession = httpSession;
    }

    @Override
    @Transactional
    public CheckoutResult processCheckout(String firstName, String lastName, String cardNumber, String expiration) {
        try {
            LocalDate expirationDate = parseExpiration(expiration);

            if (expirationDate == null) {
                return new CheckoutResult(false, "Expiration date format is invalid.", "INVALID_EXPIRATION");
            }

            boolean validCard = checkoutRepository.isValidCreditCard(
                    firstName, lastName, cardNumber, expirationDate
            );

            if (!validCard) {
                return new CheckoutResult(false, "The card information does not match our records.", "INVALID_CARD");
            }

            Integer customerId = checkoutRepository.findCustomerId(
                    firstName, lastName, cardNumber
            );

            if (customerId == null) {
                return new CheckoutResult(false, "No customer account is linked to this card.", "CUSTOMER_NOT_FOUND");
            }

            Cart cart = (Cart) httpSession.getAttribute(CART_SESSION_KEY);

            if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
                return new CheckoutResult(false, "Your cart is empty.", "EMPTY_CART");
            }

            for (CartItem item : cart.getItems()) {
                for (int i = 0; i < item.getQuantity(); i++) {
                    checkoutRepository.insertSale(customerId, item.getMovieId(), LocalDate.now());
                }
            }

            httpSession.removeAttribute(CART_SESSION_KEY);
            return new CheckoutResult(true, "Payment completed successfully.", "SUCCESS");

        } catch (DataAccessException e) {
            return new CheckoutResult(false, "Payment could not be completed due to a database error.", "DATABASE_ERROR");
        } catch (Exception e) {
            return new CheckoutResult(false, "Payment could not be completed due to a system error.", "SYSTEM_ERROR");
        }
    }

    private LocalDate parseExpiration(String expiration) {
        if (expiration == null || expiration.trim().isEmpty()) {
            return null;
        }

        try {
            return LocalDate.parse(expiration, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (DateTimeParseException e) {
            try {
                return LocalDate.parse(expiration, DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            } catch (DateTimeParseException ex) {
                return null;
            }
        }
    }
}