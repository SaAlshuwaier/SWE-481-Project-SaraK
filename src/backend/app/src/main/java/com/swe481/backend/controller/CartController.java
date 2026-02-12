package com.swe481.backend.controller;

import org.springframework.beans.factory.annotation.Autowired; // Allows automatic injection of CartService.

import org.springframework.web.bind.annotation.*; // Contains all Spring web annotations like @RestController, @GetMapping, etc.

import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;
import com.swe481.backend.service.serviceInterface.CartService;

/**
 * CartController handles HTTP requests related to the shopping cart.
 */

@RestController //Tells Spring this class returns JSON (not HTML).

@RequestMapping("/api/cart") // Base URL for all cart APIs.

public class CartController {

    @Autowired //Spring, give me the CartService implementation automatically. No need to write new CartServiceImpl()
    private CartService cartService; 

    
    /**
     * GET /api/cart
     * 
     * Purpose:
     *   Retrieve the current user's cart.
     *
     * Returns:
     *   Cart:
     *   {
     *     "items": [ { "movieId": "...","title": "......", "quantity": 2 }, ... ],
     *     "totalQuantity": 3
     *   }
     */
    @GetMapping
    public Cart getCart() {
        return cartService.getCart();
    }

    /**
     * POST /api/cart/addItem
     * 
     * Receives JSON:
     *   {
     *     "movieId": "tt123",
     *      "title": "......."
     *     "quantity": 1
     *   }
     *
     * Behavior:
     *   - If item not in cart -> add it
     *   - If item exists -> increase quantity
     *
     * Returns:
     *   Updated Cart
     */
    @PostMapping("/addItem")
    public Cart addItem(@RequestBody CartItem request) { //RequestBody: takes the JSON and converts it to java object
        return cartService.addItem(request);
    }

    /**
     * POST /api/cart/updateItem/{movieId}
     * 
     * Receives:
     *   Path variable: movieId
     *   JSON:
     *     { "quantity": 3 }
     *
     * Behavior:
     *   - Set item quantity
     *   - If quantity == 0 -> remove item
     *
     * Returns:
     *   Updated Cart
     */
    @PostMapping("/updateItem/{movieId}")
    public Cart updateItem(@PathVariable("movieId") String movieId, //PathVariable: take the part inside the URL {movieId} and pass it to the method.
                                @RequestBody CartItem request) {
        return cartService.updateItem(movieId, request.getQuantity());
    }

    /**
     * DELETE /api/cart/deleteItem/{movieId}
     * 
     * Purpose:
     *   Remove item completely from cart.
     *
     * Returns:
     *   Updated Cart
     */
    @DeleteMapping("/deleteItem/{movieId}")
    public Cart deleteItem(@PathVariable("movieId") String movieId) {
        return cartService.deleteItem(movieId);
    }

}
