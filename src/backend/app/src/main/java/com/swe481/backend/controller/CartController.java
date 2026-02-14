package com.swe481.backend.controller;

import org.springframework.beans.factory.annotation.Autowired; // Allows automatic injection of CartService.

import org.springframework.web.bind.annotation.*; // Contains all Spring web annotations like @RestController, @GetMapping, etc.

import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;
import com.swe481.backend.service.serviceInterface.CartService;

/**
 * CartController
 *
 * Handles all HTTP requests related to the Shopping Cart.
 *
 * Base URL:
 *    /api/cart
 *
 * Responsibilities:
 *    - Retrieve current cart
 *    - Add items
 *    - Update item quantity
 *    - Remove items
 *
 * Notes:
 *    - Cart is stored in user session 
 *    - All responses are returned as JSON
 */


@RestController //Tells Spring this class returns JSON (not HTML).

@RequestMapping("/api/cart") // Base URL for all cart APIs.

public class CartController {

    @Autowired //Spring, give me the CartService implementation automatically. No need to write new CartServiceImpl()
    private CartService cartService; 

    

    /**
     * GET /api/cart
     *
     * Description:
     *    Retrieve the current cart for the user.
     *
     * Logic:
     *    - Fetch cart from service layer
     *    - If cart does not exist -> return empty cart
     *
     * Returns:
     * {
     *    "items": [
     *       {
     *          "movieId": "tt123",
     *          "title": "Movie Title",
     *          "quantity": 2
     *       }
     *    ],
     *    "totalQuantity": 2
     * }
     */
    @GetMapping
    public Cart getCart() {
        return cartService.getCart();
    }

  /**
     * POST /api/cart/addItem
     *
     * Description:
     *    Add a new movie to the cart.
     *
     * Request Body:
     * {
     *    "movieId": "tt123",
     *    "title": "Movie Title",
     *    "quantity": 1
     * }
     *
     * Logic:
     *    - If movie not already in cart -> add new item
     *    - If movie exists -> increase quantity (update item)
     *
     * Returns:
     *    Updated Cart object
     */
    @PostMapping("/addItem")
    public Cart addItem(@RequestBody CartItem request) { //RequestBody: takes the JSON and converts it to java object
        return cartService.addItem(request);
    }

        /**
         * PATCH /api/cart/updateItem/{movieId}
         *
         * Purpose:
         *   Update ONLY the quantity of an existing cart item.
         *
         * Why PATCH?
         *   Because we are partially modifying the cart
         *   (only quantity, not replacing the whole item).
         *
         * Request:
         *   { "quantity": 3 }
         *
         * Returns:
         *   Updated Cart
         */
        @PatchMapping("/updateItem/{movieId}")
        public Cart updateItem(
                @PathVariable("movieId") String movieId,
                @RequestBody CartItem request) {

            return cartService.updateItem(movieId, request.getQuantity());
        }

      /**
     * DELETE /api/cart/deleteItem/{movieId}
     *
     * Description:
     *    Remove a movie completely from the cart.
     *
     * Path Variable:
     *    movieId -> ID of movie to remove
     *
     * Logic:
     *    - Locate item by movieId
     *    - Remove from cart list
     *
     * Returns:
     *    Updated Cart object
     */
    @DeleteMapping("/deleteItem/{movieId}")
    public Cart deleteItem(@PathVariable("movieId") String movieId) {
        return cartService.deleteItem(movieId);
    }

}
