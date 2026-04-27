package com.swe481.backend.service.serviceImp;
import com.swe481.backend.Dto.Repo.CustomerRepository;
import com.jooq.swe481.generated.tables.records.CustomersRecord;
import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;
import com.swe481.backend.service.serviceInterface.AuthService;
import static com.jooq.swe481.generated.tables.Customers.CUSTOMERS;

import java.time.LocalDate;

import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

/**
 * AuthServiceImpl is where authentication logic will go later.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final DSLContext dsl; // enable JOOQ type-safe queries
    private final CustomerRepository customerRepository;

    public AuthServiceImpl(DSLContext dsl, CustomerRepository customerRepository) {
        this.dsl = dsl;
        this.customerRepository = customerRepository;
    }

    /**
     * Login user
     *
     * Logic:
     * - Receives: LoginRequest (email, password)
     *
     * 1) Validate input fields (not null / not blank)
     * 2) Check if email exists in customers table
     * 3) Verify password matches stored password
     * 4) If valid -> create session and return success
     * 5) If invalid -> return failure response
     *
     * @param request {
     *                "email": "user@email.com",
     *                "password": "123456"
     *                }
     *
     * @return {
     *         "message": "Login successful",
     *         "success": true
     *         "customerId": 755001
     *         }
     */
    @Override
    public LoginResponse login(LoginRequest request) {

        //validation of blank & empty
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {

            return new LoginResponse("Email and password required", false, null);
        }

        CustomersRecord user = customerRepository.findByEmail(request.getEmail());

        //wrong credentials or user not found
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return new LoginResponse("Invalid email or password", false, null);
        }

        System.out.println("[logging in. . . with user:]" + user.getId());
        return new LoginResponse("Login successful", true, user.getId());
    }

    /**
     * Register new user account
     *
     * Logic:
     * - Receives: RegisterRequest (firstName, lastName, email, password, address,
     *             ccNumber, ccExpiration, ccFirstName, ccLastName)
     *
     * 1) Validate all required fields are not null/blank
     * 2) Validate ccExpiration is a parseable date (yyyy-MM-dd)
     * 3) Validate ccExpiration is not in the past
     * 4) Validate ccNumber is exactly 16 digits
     * 5) Check email is not already taken
     * 6) Insert credit card and customer into DB via CustomerRepository
     * 7) Return generated customerId with success response
     *
     * @param request {
     *                "firstName": "Loba",
     *                "lastName": "Alyahya",
     *                "email": "loba@email.com",
     *                "password": "1234",
     *                "address": "Riyadh",
     *                "ccNumber": "1111222233334444",
     *                "ccExpiration": "2026-01-01",
     *                "ccFirstName": "Loba",
     *                "ccLastName": "Alyahya"
     *                }
     * @return {
     *         "message": "User registered successfully",
     *         "customerId": 12,
     *         "success": true
     *         }
     */
    @Override
    public RegisterResponse register(RegisterRequest request) {

        // 1) Validate all required fields are not null/blank
        if (request.getFirstName() == null || request.getFirstName().isBlank()
                || request.getLastName() == null || request.getLastName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getAddress() == null || request.getAddress().isBlank()
                || request.getCcNumber() == null || request.getCcNumber().isBlank()
                || request.getCcExpiration() == null || request.getCcExpiration().isBlank()
                || request.getCcFirstName() == null || request.getCcFirstName().isBlank()
                || request.getCcLastName() == null || request.getCcLastName().isBlank()) {

            return new RegisterResponse("All fields are required", null, false);
        }

        // 2) Normalize ccNumber: strip all spaces so "0011 2233 4455 6677" -> "0011223344556677"
        request.setCcNumber(request.getCcNumber().replace(" ", ""));

        // 3) Validate ccExpiration is a parseable date (yyyy-MM-dd)
        LocalDate expiration;
        try {
            expiration = LocalDate.parse(request.getCcExpiration());
        } catch (Exception e) {
            return new RegisterResponse("Invalid expiration date format, use yyyy-MM-dd", null, false);
        }

        // 4) Validate expiration is not in the past
        if (expiration.isBefore(LocalDate.now())) {
            return new RegisterResponse("Credit card is expired", null, false);
        }

        // 5) Check email is not already taken
        if (customerRepository.emailExists(request.getEmail())) {
            return new RegisterResponse("Email already in use", null, false);
        }

        // 6) Check credit card number is not already registered
        if (customerRepository.creditCardExists(request.getCcNumber())) {
            return new RegisterResponse("Credit card already in use", null, false);
        }

        // 7) Insert CC + customer, get back the new customerId
        Integer newCustomerId = customerRepository.insertCustomerWithCreditCard(request);

        System.out.println("[Registered new customer with ID:] " + newCustomerId);

        // 8) Return success response
        return new RegisterResponse("User registered successfully", newCustomerId, true);
    }
}
