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
 */


@RestController //Tells Spring this class returns JSON.

@RequestMapping("/api/cart") // Base URL for all cart APIs.

public class CartController {

    @Autowired //Spring, give me the CartService implementation automatically. No need to write new CartServiceImpl()
    private CartService cartService; 


    @GetMapping
    public Cart getCart() {
        return cartService.getCart();
    }


    @PostMapping("/addItem")
    public Cart addItem(@RequestBody CartItem request) { //RequestBody: takes the JSON and converts it to java object
        return cartService.addItem(request);
    }


    @PatchMapping("/updateItem/{movieId}")
    public Cart updateItem(
            @PathVariable("movieId") String movieId,
            @RequestBody CartItem request) {

        return cartService.updateItem(movieId, request.getQuantity());
    }


    @DeleteMapping("/deleteItem/{movieId}")
    public Cart deleteItem(@PathVariable("movieId") String movieId) {
        return cartService.deleteItem(movieId);
    }

}
