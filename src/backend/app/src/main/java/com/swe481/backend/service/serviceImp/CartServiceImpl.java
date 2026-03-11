package com.swe481.backend.service.serviceImp;
import jakarta.servlet.http.HttpSession;   // Used to manage user sessions and store the cart data.
import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.Cart.CartItem;
import com.swe481.backend.service.serviceInterface.CartService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Marks this class as a Service so Spring can inject it automatically.

/**
 * CartServiceImpl is where the business logic will go later.
 */
@Service
public class CartServiceImpl implements CartService {
    
    private static final String CART_SESSION_KEY = "cart"; // Key used to store/retrieve cart from session

    private HttpSession httpSession; // Spring gives us the current user's session automatically

    @Autowired
    public CartServiceImpl(HttpSession httpSession) {
        this.httpSession = httpSession;
    }

    //These helpers are used to manage the cart in the session. 
    //They are not part of the other methods because they will create redundancy if we put them inside each method. 
    // Instead, we can call these helpers inside the main methods to keep the code clean and avoid repetition.
    // HELPER: Get cart from session, or create a fresh one if it doesn't exist yet
    private Cart getCartFromSession() {
        Cart cart = (Cart) httpSession.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            // First time this user visits —> no cart exists yet, so we create one
            cart = new Cart(new ArrayList<>(), 0);
            httpSession.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    // HELPER: Recalculate total quantity and save cart back into the session 
    private Cart saveCart(Cart cart) {
        int total = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        cart.setTotalQuantity(total);
        httpSession.setAttribute(CART_SESSION_KEY, cart); // Write updated cart back into session
        return cart;
    }

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
        // Return whatever is in the user's session
        return getCartFromSession();
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
        Cart cart = getCartFromSession();
        List<CartItem> items = cart.getItems();

        // Check if this movie is already in the cart
        for (CartItem item : items) {
            if (item.getMovieId().equals(request.getMovieId())) {
                // Movie found — just increase the quantity
                item.setQuantity(item.getQuantity() + request.getQuantity());
                return saveCart(cart);  // Save and exit early, no need to keep looping
            }
        }

        // Movie not found in cart —> add it as a brand new entry
        items.add(new CartItem(request.getMovieId(), request.getTitle(), request.getQuantity()));
        return saveCart(cart);
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
        Cart cart = getCartFromSession();
        List<CartItem> items = cart.getItems();

        if (quantity == 0) {
            // Quantity 0 means the user wants to remove it completely
                return deleteItem(movieId);
        } else {
            // Otherwise find the item and set the new quantity
            for (CartItem item : items) {
                if (item.getMovieId().equals(movieId)) {
                    item.setQuantity(quantity);
                    break; // Found and updated, no need to keep looping
                }
            }
        }

        return saveCart(cart);
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
        return getCartFromSession(); // Placeholder: just return the cart for now, no actual deletion logic yet (sprint 2 we will implement it)
    }
}
