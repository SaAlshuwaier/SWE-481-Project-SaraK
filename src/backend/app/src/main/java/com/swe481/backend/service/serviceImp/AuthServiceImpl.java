package com.swe481.backend.service.serviceImp;

import com.swe481.backend.service.serviceInterface.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public boolean authenticate(String email, String password) {

        // TODO (Phase 3):
        // Connect to database (customers table)
        // Validate email/password securely

        return true; // temporary dummy response for Phase 2 testing
    }
}
