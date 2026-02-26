package com.swe481.backend.ServiceUnitTesting.serviceInterface;
import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;

/**
 * CartService defines the operations that the cart must support.
 */
public interface CartService {

    // Return the current cart
    public Cart getCart();

    //The following methods return the new cart after modification (Add, Update, Delete)
    // Add a new item to the cart (first of this movie)
    public Cart addItem(CartItem request);

    // Update quantity of a specific item
    public Cart updateItem(String movieId, int quantity);

    // Remove item completely from cart 
    public Cart deleteItem(String movieId);
}
