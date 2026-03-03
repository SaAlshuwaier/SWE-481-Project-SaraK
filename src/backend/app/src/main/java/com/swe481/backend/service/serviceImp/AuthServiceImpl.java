package com.swe481.backend.service.serviceImp;
import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.LogoutResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;
import com.swe481.backend.service.serviceInterface.AuthService;
import org.springframework.stereotype.Service;
/**
 * AuthServiceImpl is where authentication logic will go later.
 */
@Service
public class AuthServiceImpl implements AuthService {
 /**
     * Login user
     *
     * Logic:
     * - Receives: LoginRequest (email, password)
     * - Phase 2 (Dummy):
     *     - Always returns success = true
     *
     * Phase 3 (Real Implementation):
     *     1) Validate input fields (not null / not blank)
     *     2) Check if email exists in customers table
     *     3) Verify password matches stored password
     *     4) If valid -> create session and return success
     *     5) If invalid -> return failure response
     *
     * @param request {
     *   "email": "user@email.com",
     *   "password": "123456"
     * }
     *
     * @return {
     *   "message": "Login successful",
     *   "success": true
     * }
     */
    @Override
       public LoginResponse login(LoginRequest request) {

        LoginResponse response = new LoginResponse();

        // Phase 2: always successful 
        response.setSuccess(true);
        response.setMessage("Login successful");
        return response;
    }
 /**
     * Logout user
     *
     * Logic:
     * - Receives: nothing (logout current session)
     * - Phase 2 (Dummy):
     *     - Always returns success = true
     *
     * Phase 3 (Real Implementation):
     *     1) Invalidate session / clear authentication context
     *     2) Return logout confirmation message
     *
     * @return {
     *   "message": "Logout successful",
     *   "success": true
     * }
     */
    @Override
    public LogoutResponse logout() {

        LogoutResponse response = new LogoutResponse();
         // Phase 2: always successful 
        response.setSuccess(true);
        response.setMessage("Logout successful");
        return response;
    }
 /**
     * Register new user account
     *
     * Logic:
     * - Receives: RegisterRequest (firstName, lastName, email, password, address, ccId)
     * - Phase 2 (Dummy):
     *     - Always returns success = true
     *
     * Phase 3 (Real Implementation):
     *     1) Validate all required fields
     *     2) Check if email already exists in customers table
     *     3) Validate ccId exists in creditcards table
     *     4) Insert new customer into customers table
     *     5) Return generated customerId with success response
     *
     * @param request {
     *   "firstName": "Loba",
     *   "lastName": "Alyahya",
     *   "email": "loba@email.com",
     *   "password": "1234",
     *   "address": "Riyadh",
     *   "ccId": "1234567890123456"
     * }
     *
     * @return {
     *   "message": "User registered successfully",
     *   "customerId": 12,
     *   "success": true
     * }
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



