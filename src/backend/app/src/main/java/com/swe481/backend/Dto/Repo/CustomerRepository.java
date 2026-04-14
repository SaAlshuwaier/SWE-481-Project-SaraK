package com.swe481.backend.Dto.Repo;

import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.jooq.swe481.generated.tables.records.CustomersRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import static com.jooq.swe481.generated.tables.Customers.CUSTOMERS;
import static com.jooq.swe481.generated.tables.Creditcards.CREDITCARDS;

@Repository
public class CustomerRepository {

    private final DSLContext dsl;

    public CustomerRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    /**
     * Check if an email already exists in the customers table.
     *
     * @param email the email to check
     * @return true if taken, false if available
     */
    public boolean emailExists(String email) {
        return dsl.fetchExists(
                dsl.selectFrom(CUSTOMERS)
                        .where(CUSTOMERS.EMAIL.eq(email)));
    }

    /**
     * Check if a credit card number already exists in the creditcards table.
     *
     * @param ccNumber the formatted card number ("XXXX XXXX XXXX XXXX")
     * @return true if the card number is already registered, false if available
     */
    public boolean creditCardExists(String ccNumber) {
    return dsl.fetchExists(
            dsl.selectFrom(CREDITCARDS)
                    .where(CREDITCARDS.ID.eq(ccNumber)));
    }

    /**
     * Inserts a new credit card row, then inserts a new customer linked to it.
     *
     * creditcards table: (id, firstName, lastName, expiration)
     * customers table:   (firstName, lastName, ccId, address, email, password)
     *
     * @param request the RegisterRequest from the frontend
     * @return the generated customerId (SERIAL)
     */
    public Integer insertCustomerWithCreditCard(RegisterRequest request) {

        // Step 1: Insert the credit card
        dsl.insertInto(CREDITCARDS)
                .set(CREDITCARDS.ID, request.getCcNumber())
                .set(CREDITCARDS.FIRSTNAME, request.getCcFirstName())
                .set(CREDITCARDS.LASTNAME, request.getCcLastName())
                .set(CREDITCARDS.EXPIRATION, LocalDate.parse(request.getCcExpiration()))
                .execute();

        // Step 2: Insert the customer linked to the new credit card
        CustomersRecord customerRecord = dsl.insertInto(CUSTOMERS)
                .set(CUSTOMERS.FIRSTNAME, request.getFirstName())
                .set(CUSTOMERS.LASTNAME, request.getLastName())
                .set(CUSTOMERS.EMAIL, request.getEmail())
                .set(CUSTOMERS.PASSWORD, request.getPassword())
                .set(CUSTOMERS.ADDRESS, request.getAddress())
                .set(CUSTOMERS.CCID, request.getCcNumber())
                .returning(CUSTOMERS.ID)
                .fetchOne();

        return customerRecord.getId();
    }

    /** Retrieves customer by email. */
    public CustomersRecord findByEmail(String email) {
    return dsl
            .selectFrom(CUSTOMERS)
            .where(CUSTOMERS.EMAIL.eq(email))
            .fetchOne();
}
}