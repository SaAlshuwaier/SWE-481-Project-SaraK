package com.swe481.backend.service.serviceImp;

import com.jooq.swe481.generated.tables.records.CustomersRecord;
import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.LogoutResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;
import com.swe481.backend.service.serviceInterface.AuthService;
import static com.jooq.swe481.generated.tables.Customers.CUSTOMERS;

import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

/**
 * AuthServiceImpl is where authentication logic will go later.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final DSLContext dsl; // enable JOOQ type-safe queries

    public AuthServiceImpl(DSLContext dsl) {
        this.dsl = dsl;
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

        CustomersRecord user = dsl
                .selectFrom(CUSTOMERS)
                .where(CUSTOMERS.EMAIL.eq(request.getEmail()))
                .fetchOne();

        //wrong credentials or user not found
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return new LoginResponse("Invalid email or password", false, null);
        }

        System.out.println("[logging in. . . with user:]" + user.getId());
        return new LoginResponse("Login successful", true, user.getId());
    }

    /**
     * Logout user
     *
     * Logic:
     * - Receives: nothing (logout current session)
     * 
     * 1) Invalidate session / clear authentication context
     * 2) Return logout confirmation message
     *
     ** @return {
     *         "message": "Logout successful",
     *         "success": true
     *         }
     */
   /*  @Override
    public LogoutResponse logout() {
         return new LogoutResponse("Login successful", true);
    } */

    /**
     * Register new user account
     *
     * Logic:
     * - Receives: RegisterRequest (firstName, lastName, email, password, address,
     * ccId)
     * - Phase 2 (Dummy):
     * - Always returns success = true
     *
     * Phase 3 (Real Implementation):
     * 1) Validate all required fields
     * 2) Check if email already exists in customers table
     * 3) Validate ccId exists in creditcards table
     * 4) Insert new customer into customers table
     * 5) Return generated customerId with success response
     *
     * @param request {
     *                "firstName": "Loba",
     *                "lastName": "Alyahya",
     *                "email": "loba@email.com",
     *                "password": "1234",
     *                "address": "Riyadh",
     *                "ccId": "1234567890123456"
     *                }
     *
     * @return {
     *         "message": "User registered successfully",
     *         "customerId": 12,
     *         "success": true
     *         }
     */
    @Override
    public RegisterResponse register(RegisterRequest request) {

        RegisterResponse response = new RegisterResponse();

        // Phase 2: always successful
        response.setSuccess(true);
        response.setMessage("User registered successfully");
        return response;
    }
}
