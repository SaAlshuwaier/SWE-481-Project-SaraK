package com.swe481.backend.service.serviceImp;

import com.swe481.backend.model.Auth.LoginRequest;
import com.swe481.backend.model.Auth.LoginResponse;
import com.swe481.backend.model.Auth.LogoutResponse;
import com.swe481.backend.model.Auth.RegisterRequest;
import com.swe481.backend.model.Auth.RegisterResponse;
import com.swe481.backend.service.serviceInterface.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
       public LoginResponse login(LoginRequest request) {

        LoginResponse response = new LoginResponse();

        // Phase 2: always successful 
        response.setSuccess(true);
        response.setMessage("Login successful");
        return response;
    }

    @Override
    public LogoutResponse logout() {

        LogoutResponse response = new LogoutResponse();
         // Phase 2: always successful 
        response.setSuccess(true);
        response.setMessage("Logout successful");
        return response;
    }

     @Override
    public RegisterResponse register(RegisterRequest request) {

        RegisterResponse response = new RegisterResponse();

         // Phase 2: always successful 
        response.setSuccess(true);
        response.setMessage("User registered successfully");
        return response;
    }
}



