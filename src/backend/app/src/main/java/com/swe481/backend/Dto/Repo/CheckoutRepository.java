package com.swe481.backend.Dto.Repo;

import java.time.LocalDate;

import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import static com.jooq.swe481.generated.tables.Creditcards.CREDITCARDS;
import static com.jooq.swe481.generated.tables.Customers.CUSTOMERS;
import static com.jooq.swe481.generated.tables.Sales.SALES;

@Repository
public class CheckoutRepository {

    private final DSLContext dsl;

    public CheckoutRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public boolean isValidCreditCard(String firstName, String lastName, String cardNumber, LocalDate expiration) {
        cardNumber = cardNumber.replaceAll("[ -]", ""); // strip spaces and dashes from input
        return dsl.fetchExists(
                dsl.selectOne()
                        .from(CREDITCARDS)
                        .where(DSL.replace(
                            DSL.replace(CREDITCARDS.ID, " ", ""),
                            "-", "")
                        .eq(cardNumber))                        
                        .and(CREDITCARDS.FIRSTNAME.eq(firstName))
                        .and(CREDITCARDS.LASTNAME.eq(lastName))
                        .and(CREDITCARDS.EXPIRATION.eq(expiration))
        );
    }

    public Integer findCustomerId(String firstName, String lastName, String cardNumber) {
        cardNumber = cardNumber.replaceAll("[ -]", ""); // strip user input
        return dsl.select(CUSTOMERS.ID)
                .from(CUSTOMERS)
                .where(DSL.replace(
                        DSL.replace(CUSTOMERS.CCID, " ", ""),
                        "-", "")
                .eq(cardNumber))
                .and(CUSTOMERS.FIRSTNAME.eq(firstName))
                .and(CUSTOMERS.LASTNAME.eq(lastName))
                .fetchOne(CUSTOMERS.ID);
    }

    public void insertSale(Integer customerId, String movieId, LocalDate saleDate) {
        dsl.insertInto(SALES)
                .set(SALES.CUSTOMERID, customerId)
                .set(SALES.MOVIEID, movieId)
                .set(SALES.SALEDATE, saleDate)
                .execute();
    }
}