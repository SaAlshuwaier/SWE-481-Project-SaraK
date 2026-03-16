package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.Cart.CartItem;
import com.swe481.backend.service.serviceImp.CartServiceImpl;

import jakarta.servlet.http.HttpSession;

public class CartServiceImplUnitTest {

    private CartServiceImpl cartService;
    private HttpSession mockSession;
    private Map<String, Object> sessionStore;

    @BeforeEach
    public void setup() {
        sessionStore = new HashMap<>();
        mockSession = Mockito.mock(HttpSession.class);

        Mockito.when(mockSession.getAttribute(Mockito.anyString()))
            .thenAnswer(i -> sessionStore.get(i.getArgument(0)));

        Mockito.doAnswer(i -> {
            sessionStore.put(i.getArgument(0), i.getArgument(1));
            return null;
        }).when(mockSession).setAttribute(Mockito.anyString(), Mockito.any());

        cartService = new CartServiceImpl(mockSession);
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
        assertEquals(1, cart.getTotalQuantity());
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
        assertEquals(0, result.getTotalQuantity());
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
