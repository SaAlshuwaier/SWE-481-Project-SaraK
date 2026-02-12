package com.swe481.backend.model; // This defines the package (folder) where this class belongs (it is the path)
import java.util.ArrayList;  // Used to create an empty list of cart items.
import java.util.List;  // List is the interface used to store multiple CartItem objects.

import lombok.Data; //Creates setters, getters and constructors 

/**
 * CartModel represents the shopping cart.
 * It contains:
 *  - A list of items -> a cartItem is the movieID, title and quantity
 *  - The total quantity of all items
 */
@Data
public class Cart {

    // List that stores all items inside the cart
    private List<CartItem> items = new ArrayList<>();
    // Total quantity of all items combined
    private int totalQuantity;

    // Default constructor (required for JSON conversion)
    public Cart() {}

    // Constructor to create a cart with predefined values
    public Cart(List<CartItem> items, int totalQuantity) {
        this.items = items;
        this.totalQuantity = totalQuantity;
    }


    /**
     * Nested static class representing a single item in the cart.
     */
    @Data
    public static class CartItem {

        // ID of the movie
        private String movieId;
        // Movie title (for performance purpose it is better for us to add it here instead of looping over all movies by the movieID to get the title)
        private String title;
        // Quantity of this movie in the cart
        private int quantity;

        // Default constructor (needed for JSON mapping)
        public CartItem() {}

        // Constructor with values
        public CartItem(String movieId, String title, int quantity) {
            this.movieId = movieId;
            this.title = title;
            this.quantity = quantity;
        }
    }
}

