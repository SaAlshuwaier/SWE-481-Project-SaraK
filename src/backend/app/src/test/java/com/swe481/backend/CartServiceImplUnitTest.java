package com.swe481.backend;

import com.swe481.backend.model.Cart;
import com.swe481.backend.model.Cart.CartItem;
import com.swe481.backend.service.serviceImp.CartServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)

public class CartServiceImplUnitTest {

    CartServiceImpl cartService;

    @BeforeEach
    public void setup() {
        cartService = new CartServiceImpl();
    }

    // ─── getCart ───────────────────────────────────────────────

    @Test
    public void testGetCart_returnsCart() {
        Cart cart = cartService.getCart();
        assertNotNull(cart);
    }

    @Test
    public void testGetCart_initiallyEmpty() {
        Cart cart = cartService.getCart();
        assertNotNull(cart.getItems());
        assertEquals(0, cart.getTotalQuantity());
    }

    // ─── addItem ───────────────────────────────────────────────

    @Test
    public void testAddItem_returnsCart() {
        CartItem item = new CartItem("tt0421974", "Fighters", 1);
        Cart cart = cartService.addItem(item);
        assertNotNull(cart);
    }

    @Test
    public void testAddItem_newItem_appearsInCart() {
        CartItem item = new CartItem("tt0496319", "The Hottest State", 1);
        Cart result = cartService.addItem(item);
        assertEquals(1, result.getItems().size()); // item was added
        assertEquals(1, result.getTotalQuantity()); // total updated
    }

    @Test
    public void testAddItem_existingItem_increasesQuantity() {
        CartItem item = new CartItem("tt0264464", "Catch Me If You Can", 1);
        cartService.addItem(item); // add first time
        cartService.addItem(item); // add again

        Cart result = cartService.getCart();
        assertEquals(1, result.getItems().size()); // still one item
        assertEquals(2, result.getTotalQuantity()); // but quantity increased
    }

    @Test
    public void testAddItem_multipleItems_totalQuantityCorrect() {
        cartService.addItem(new CartItem("tt0421974", "Fighters", 1));
        cartService.addItem(new CartItem("tt0278823", "Hollywood Ending", 2));

        Cart result = cartService.getCart();
        assertEquals(2, result.getItems().size()); // two different items
        assertEquals(3, result.getTotalQuantity()); // 1 + 2 = 3
    }

    // ─── updateItem ────────────────────────────────────────────

    @Test
    public void testUpdateItem_withZeroQuantity_returnsCart() {
        Cart result = cartService.updateItem("tt0264464", 0);
        assertNotNull(result);
    }

    @Test
    public void testUpdateItem_changesQuantity() {
        CartItem item = new CartItem("tt0344510", "A Very Long Engagement", 1);
        cartService.addItem(item); // add item first

        Cart result = cartService.updateItem("tt0344510", 5);
        assertEquals(5, result.getTotalQuantity()); // quantity updated to 5
    }

    @Test
    public void testUpdateItem_withZeroQuantity_removesItem() {
        CartItem item = new CartItem("tt0344510", "A Very Long Engagement", 2);
        cartService.addItem(item); // add item first

        Cart result = cartService.updateItem("tt0344510", 0);
        assertEquals(0, result.getItems().size()); // item removed
        assertEquals(0, result.getTotalQuantity()); // total is 0
    }

}
