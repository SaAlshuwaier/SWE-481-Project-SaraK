package com.swe481.backend.ControllerIntegrationTesting;

import com.swe481.backend.Dto.Cart;
import com.swe481.backend.Dto.Cart.CartItem;
import org.jooq.DSLContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.jooq.swe481.generated.tables.Creditcards.CREDITCARDS;
import static com.jooq.swe481.generated.tables.Customers.CUSTOMERS;
import static com.jooq.swe481.generated.tables.Movies.MOVIES;
import static com.jooq.swe481.generated.tables.Sales.SALES;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CheckoutControllerIntegrationTesting {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DSLContext dsl;

    private static final String TEST_CARD_ID = "4111111111111111";
    private static final String TEST_FIRST_NAME = "Neil";
    private static final String TEST_LAST_NAME = "Kope";
    private static final LocalDate TEST_EXPIRATION = LocalDate.of(2030, 12, 1);

    @AfterEach
    void cleanUp() {
        dsl.deleteFrom(SALES)
                .where(SALES.CUSTOMERID.in(
                        dsl.select(CUSTOMERS.ID)
                                .from(CUSTOMERS)
                                .where(CUSTOMERS.CCID.eq(TEST_CARD_ID))
                ))
                .execute();

        dsl.deleteFrom(CUSTOMERS)
                .where(CUSTOMERS.CCID.eq(TEST_CARD_ID))
                .execute();

        dsl.deleteFrom(CREDITCARDS)
                .where(CREDITCARDS.ID.eq(TEST_CARD_ID))
                .execute();
    }

    @Test
    void checkoutWhenMissingFields() throws Exception {
        String requestJson = """
            { "firstName": "Neil" }
        """;

        mockMvc.perform(
                post("/api/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void checkoutWhenValidDataAndCartExistsShouldReturn200AndInsertSales() throws Exception {
        String existingMovieId = dsl.select(MOVIES.ID)
                .from(MOVIES)
                .limit(1)
                .fetchOne(MOVIES.ID);

        assertNotNull(existingMovieId, "No movie found in database to use for checkout test");

        dsl.insertInto(CREDITCARDS)
                .set(CREDITCARDS.ID, TEST_CARD_ID)
                .set(CREDITCARDS.FIRSTNAME, TEST_FIRST_NAME)
                .set(CREDITCARDS.LASTNAME, TEST_LAST_NAME)
                .set(CREDITCARDS.EXPIRATION, TEST_EXPIRATION)
                .execute();

        dsl.insertInto(CUSTOMERS)
                .set(CUSTOMERS.FIRSTNAME, TEST_FIRST_NAME)
                .set(CUSTOMERS.LASTNAME, TEST_LAST_NAME)
                .set(CUSTOMERS.CCID, TEST_CARD_ID)
                .set(CUSTOMERS.ADDRESS, "Riyadh")
                .set(CUSTOMERS.EMAIL, "neil.kope@test.com")
                .set(CUSTOMERS.PASSWORD, "1234")
                .execute();

        Cart cart = new Cart(new ArrayList<>(), 0);
        List<CartItem> items = new ArrayList<>();
        items.add(new CartItem(existingMovieId, "Test Movie", 2));
        cart.setItems(items);
        cart.setTotalQuantity(2);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("cart", cart);

        String requestJson = """
            {
              "firstName": "Neil",
              "lastName": "Kope",
              "cardNumber": "4111111111111111",
              "expiration": "2030-12-01"
            }
        """;

        mockMvc.perform(
                post("/api/checkout")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Transaction succeeded"));

        Integer customerId = dsl.select(CUSTOMERS.ID)
                .from(CUSTOMERS)
                .where(CUSTOMERS.CCID.eq(TEST_CARD_ID))
                .fetchOne(CUSTOMERS.ID);

        Integer salesCount = dsl.fetchCount(
                dsl.selectFrom(SALES)
                        .where(SALES.CUSTOMERID.eq(customerId))
                        .and(SALES.MOVIEID.eq(existingMovieId))
        );

        org.junit.jupiter.api.Assertions.assertEquals(2, salesCount);
    }
}