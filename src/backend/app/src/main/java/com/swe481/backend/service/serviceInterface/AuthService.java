package com.swe481.backend.service.serviceInterface;

import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;

public interface AuthService {
    /**
     * Login action: (Here we start the session)
     * - Accepts: LoginRequest(email, password)
     * - Returns: LoginResponse
     */
    LoginResponse login(LoginRequest request);

     /**
     * Register action:
     * - Accepts: RegisterRequest (firstName, lastName, email, password, address, ccId)
     * - Returns: RegisterResponse 
     */
    RegisterResponse register(RegisterRequest request);
}
