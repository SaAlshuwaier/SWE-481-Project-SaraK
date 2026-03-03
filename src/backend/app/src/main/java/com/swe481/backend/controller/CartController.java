package com.swe481.backend.controller;

import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.Cart.CartItem;
import com.swe481.backend.service.serviceInterface.CartService;
import org.springframework.beans.factory.annotation.Autowired; // Allows automatic injection of CartService.
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Contains all Spring web annotations like @RestController, @GetMapping, etc.

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
    public ResponseEntity<Cart> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }


    @PostMapping("/addItem")
    public ResponseEntity<Cart> addItem(@RequestBody CartItem request) { //RequestBody: takes the JSON and converts it to java object
        return ResponseEntity.ok(cartService.addItem(request));
    }


    @PatchMapping("/updateItem/{movieId}")
    public ResponseEntity<Cart> updateItem(
            @PathVariable("movieId") String movieId,
            @RequestBody CartItem request) {

        return ResponseEntity.ok(cartService.updateItem(movieId, request.getQuantity()));
    }


    @DeleteMapping("/deleteItem/{movieId}")
    public ResponseEntity<Cart> deleteItem(@PathVariable("movieId") String movieId) {
        return ResponseEntity.ok(cartService.deleteItem(movieId));
    }

}
