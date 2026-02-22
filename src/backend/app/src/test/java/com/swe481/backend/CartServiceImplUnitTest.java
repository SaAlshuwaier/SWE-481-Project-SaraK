package com.swe481.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;

import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;
import com.swe481.backend.service.serviceImp.CartServiceImpl;

public class CartServiceImplUnitTest {
    CartServiceImpl cartService = new CartServiceImpl();

    @Test
    void deleteItemWhenQuantityIsOne_removesItemCompletely() {

        Cart cart = cartService.getCart();

        cart.getItems().clear();

        cart.getItems().add(new CartItem("tt0421974", "Sky Fighters", 2));
        cart.getItems().add(new CartItem("tt0378947", "Melinda and Melinda", 1));

        cart.setTotalQuantity(3); // 2 + 1

        Cart updated = cartService.deleteItem("tt0378947");

        // One item should remain
        assertEquals(1, updated.getItems().size());

        // Total should now be 2
        assertEquals(2, updated.getTotalQuantity());

        boolean stillExists = updated.getItems().stream()
                .anyMatch(i -> i.getMovieId().equals("tt0378947"));

        assertFalse(stillExists);
    }

    //Assuming later we will add a delete button to directly delete the item regardless of quantity.
    @Test
    void deleteItemWhenQuantityGreaterThanOne_removesItemCompletely() {

        Cart cart = cartService.getCart();

        cart.getItems().clear();

        cart.getItems().add(new CartItem("tt0278823", "Hollywood Ending", 3));
        cart.getItems().add(new CartItem("tt0421974", "Sky Fighters", 2));

        cart.setTotalQuantity(5); // 3 + 2

        Cart updated = cartService.deleteItem("tt0278823");

        // One item should remain
        assertEquals(1, updated.getItems().size());

        // Total should now be 2
        assertEquals(2, updated.getTotalQuantity());

        boolean stillExists = updated.getItems().stream()
                .anyMatch(i -> i.getMovieId().equals("tt0278823"));

        assertFalse(stillExists);
    }

    @Test
    void deleteItemWhenDeletingOnlyItem_resultsInEmptyCart() {

        Cart cart = cartService.getCart();

        cart.getItems().clear();

        cart.getItems().add(new CartItem("tt0313792", "Anything Else", 1));
        cart.setTotalQuantity(1);

        Cart updated = cartService.deleteItem("tt0313792");

        assertEquals(0, updated.getItems().size());
        assertEquals(0, updated.getTotalQuantity());
    }

      @Test
    void deleteItemWhenMovieDoesNotExist_cartRemainsUnchanged() {

        Cart cart = cartService.getCart();

        cart.getItems().clear();

        cart.getItems().add(new CartItem("tt0421974", "Sky Fighters", 2));
        cart.getItems().add(new CartItem("tt0378947", "Melinda and Melinda", 1));

        cart.setTotalQuantity(3);

        int sizeBefore = cart.getItems().size();
        int totalBefore = cart.getTotalQuantity();

        Cart updated = cartService.deleteItem("tt0228333");

        assertEquals(sizeBefore, updated.getItems().size());
        assertEquals(totalBefore, updated.getTotalQuantity());
    }

      @Test
    void deleteItemWhenMovieIdIsNull_cartRemainsUnchanged() {

        Cart cart = cartService.getCart();

        cart.getItems().clear();

        cart.getItems().add(new CartItem("tt0421974", "Sky Fighters", 2));
        cart.setTotalQuantity(2);

        int sizeBefore = cart.getItems().size();
        int totalBefore = cart.getTotalQuantity();

        Cart updated = cartService.deleteItem(null);

        assertEquals(sizeBefore, updated.getItems().size());
        assertEquals(totalBefore, updated.getTotalQuantity());
    }

    @Test
    void deleteItemWhenMovieIdIsBlank_cartRemainsUnchanged() {

        Cart cart = cartService.getCart();

        cart.getItems().clear();

        cart.getItems().add(new CartItem("tt0421974", "Sky Fighters", 2));
        cart.setTotalQuantity(2);

        int sizeBefore = cart.getItems().size();
        int totalBefore = cart.getTotalQuantity();

        Cart updated = cartService.deleteItem("   ");

        assertEquals(sizeBefore, updated.getItems().size());
        assertEquals(totalBefore, updated.getTotalQuantity());
    }


}
