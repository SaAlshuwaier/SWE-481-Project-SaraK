package com.swe481.backend.service.serviceInterface;

public interface AuthService {
    boolean authenticate(String email, String password);
}
