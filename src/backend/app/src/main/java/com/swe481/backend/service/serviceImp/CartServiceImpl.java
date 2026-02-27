package com.swe481.backend.service.serviceImp;

import com.swe481.backend.service.serviceInterface.CartService;
import org.springframework.stereotype.Service; // Marks this class as a Service so Spring can inject it automatically.

import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;

/**
 * CartServiceImpl is where the business logic will go later.
 */
@Service
public class CartServiceImpl implements CartService {
    
    //dummy for phase 2
    private final Cart cart = new Cart();

    /**
     * Get the current cart
     *
     * Logic:
     * - If cart is null -> return empty cart
     * - Returns: Cart (items + totalQuantity)
     *
     *
     * @return {
     *   "items": [
     *     {
     *       "movieId": "tt123",
     *       "title": "Movie Title",
     *       "quantity": 2
     *     }
     *   ],
     *   "totalQuantity": 2
     * }
    */
    @Override
    public Cart getCart() {
        // Will later return cart stored in session
        return cart;
    }


    /**
     * Add an item to the cart
     *
     * Logic:
     * - Receives: CartItem (movieId, title, quantity)
     *     - Item is added to the cart list
     *     - Recalculate totalQuantity
     * - Returns: Updated Cart
     *
     *
     * @param request {
     *   "movieId": "tt123",
     *   "title": "Movie Title",
     *   "quantity": 1
     * }
     *
     * @return {
     *   "items": [
     *     {
     *       "movieId": "tt123",
     *       "title": "Movie Title",
     *       "quantity": 1
     *     }
     *   ],
     *   "totalQuantity": 1
     * }
     */
    @Override
    public Cart addItem(CartItem request) {
        // Will later:
        // 1. Check if item exists
        // 2. Add or increase (update) quantity
        return cart;
    }

    /**
     * Update quantity of an existing cart item
     *
     * Logic:
     * - Receives: movieId + quantity:
     *     - Find item by movieId
     *     - If quantity == 0 -> remove item
     *     - Else -> set new quantity
     *     - Recalculate totalQuantity
     * - Returns: Updated Cart
     *
     *
     * @param movieId the movie ID passed in the URL path (example: "tt123")
     * @param quantity the new quantity value
     *
     * @return {
     *   "items": [
     *     {
     *       "movieId": "tt123",
     *       "title": "Movie Title",
     *       "quantity": 3
     *     }
     *   ],
     *   "totalQuantity": 3
     * }
     */
    @Override
    public Cart updateItem(String movieId, int quantity) {
        // Will later:
        // 1. If quantity == 0 then remove
        // 2. Otherwise update quantity
        return cart;
    }


     /**
     * Delete an item from the cart
     *
     * Logic:
     * - Receives: movieId
     *     - Find item by movieId
     *     - Remove it from items list
     *     - Recalculate totalQuantity
     * - Returns: Updated Cart
     *
     * @param movieId the movie ID to remove (example: "tt123")
     *
     * @return { 
     *   "items": [],
     *   "totalQuantity": 0
     * } 
     */
    @Override
    public Cart deleteItem(String movieId) {
        // Will later remove item completely
        return cart;
    }
}
