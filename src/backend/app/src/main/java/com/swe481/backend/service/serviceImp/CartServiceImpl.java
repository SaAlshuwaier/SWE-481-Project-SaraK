package com.swe481.backend.service.serviceImp;

import org.springframework.stereotype.Service; // Marks this class as a Service so Spring can inject it automatically.

import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;
import com.swe481.backend.service.serviceInterface.CartService;

/**
 * CartServiceImpl is where the business logic will go later.
 */
@Service
public class CartServiceImpl implements CartService {

    @Override
    public Cart getCart() {
        // Will later return cart stored in session
        return null;
    }

    @Override
    public Cart addItem(CartItem request) {
        // Will later:
        // 1. Check if item exists
        // 2. Add or increase (update) quantity
        return null;
    }

    @Override
    public Cart updateItem(String movieId, int quantity) {
        // Will later:
        // 1. If quantity == 0 then remove
        // 2. Otherwise update quantity
        return null;
    }

    @Override
    public Cart deleteItem(String movieId) {
        // Will later remove item completely
        return null;
    }
}
