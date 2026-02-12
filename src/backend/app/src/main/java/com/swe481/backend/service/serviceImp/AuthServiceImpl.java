package com.swe481.backend.service.serviceImp;

import com.swe481.backend.service.serviceInterface.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private static final String DUMMY_EMAIL = "test@uci.edu";
    private static final String DUMMY_PASSWORD = "test123";

    @Override
    public boolean authenticate(String email, String password) {
        return DUMMY_EMAIL.equals(email) && DUMMY_PASSWORD.equals(password);
    }
}
