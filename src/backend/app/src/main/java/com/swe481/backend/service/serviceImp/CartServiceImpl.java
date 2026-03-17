package com.swe481.backend.service.serviceImp;

import jakarta.servlet.http.HttpSession;
import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.Cart.CartItem;
import com.swe481.backend.service.serviceInterface.CartService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {
    
    private static final String CART_SESSION_KEY = "cart";

    private HttpSession httpSession;

    @Autowired
    public CartServiceImpl(HttpSession httpSession) {
        this.httpSession = httpSession;
    }

    private Cart getCartFromSession() {
        Cart cart = (Cart) httpSession.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            cart = new Cart(new ArrayList<>(), 0);
            httpSession.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    private Cart saveCart(Cart cart) {
        int total = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        cart.setTotalQuantity(total);
        httpSession.setAttribute(CART_SESSION_KEY, cart);
        return cart;
    }

    @Override
    public Cart getCart() {
        return getCartFromSession();
    }

    @Override
    public Cart addItem(CartItem request) {
        Cart cart = getCartFromSession();
        List<CartItem> items = cart.getItems();

        for (CartItem item : items) {
            if (item.getMovieId().equals(request.getMovieId())) {
                item.setQuantity(item.getQuantity() + request.getQuantity());
                return saveCart(cart);
            }
        }

        items.add(new CartItem(request.getMovieId(), request.getTitle(), request.getQuantity()));
        return saveCart(cart);
    }

    @Override
    public Cart updateItem(String movieId, int quantity) {
        Cart cart = getCartFromSession();
        List<CartItem> items = cart.getItems();

        if (quantity == 0) {
            return deleteItem(movieId);
        } else {
            for (CartItem item : items) {
                if (item.getMovieId().equals(movieId)) {
                    item.setQuantity(quantity);
                    break;
                }
            }
        }

        return saveCart(cart);
    }

    @Override
    public Cart deleteItem(String movieId) {
        Cart cart = getCartFromSession();
        List<CartItem> items = cart.getItems();

        items.removeIf(item -> item.getMovieId().equals(movieId));

        return saveCart(cart);
    }
}