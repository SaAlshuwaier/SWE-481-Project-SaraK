package com.swe481.backend.ServiceUnitTesting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jooq.swe481.generated.tables.records.CustomersRecord;
import com.swe481.backend.Dto.Auth.LoginRequest;
import com.swe481.backend.Dto.Auth.LoginResponse;
import com.swe481.backend.Dto.Auth.RegisterRequest;
import com.swe481.backend.Dto.Auth.RegisterResponse;
import com.swe481.backend.Dto.Repo.CustomerRepository;
import com.swe481.backend.service.serviceImp.AuthServiceImpl;

/**
 * Unit tests for AuthServiceImpl methods.
 * 
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceImplUnitTest {
    private CustomerRepository customerRepository;
    private DSLContext dls;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        dls = Mockito.mock(DSLContext.class);
        customerRepository = mock(CustomerRepository.class);
        authService = new AuthServiceImpl(dls, customerRepository);

    }

    /**
     * Tests the behavior of login(...)
     * 
     * The tested scenarios include:
     * - Valid credentials → login succeeds.
     * - Missing or empty input → validation error is returned.
     * - wrong email and passowrd → login fails.
     * - correct email wrong password → login fails.
     * - wrong email correct password → login fails.
     */
@Test
void login_validRequest_returnsSuccessTrueAndCorrectMessage() {

    CustomersRecord mockUser = new CustomersRecord();
    mockUser.setEmail("ar@tilae.com");
    mockUser.setPassword("strike");

    when(customerRepository.findByEmail(anyString()))
            .thenReturn(mockUser);

    LoginRequest request = new LoginRequest("ar@tilae.com", "strike");

    LoginResponse response = authService.login(request);

    System.out.println(response.getMessage());

    assertNotNull(response);
    assertEquals("Login successful", response.getMessage());
    assertTrue(response.isSuccess());
}

    @Test
    void login_emptyEmailOrPassword_returnsFailure() {

        LoginRequest request = new LoginRequest("", "");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Email and password required", response.getMessage());
    }

    @Test
    void login_invalidCredentials_returnsFailure() {

        LoginRequest request = new LoginRequest("wrong@email.com", "wrong");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
    }

    @Test
    void login_validEmailWrongPassword_returnsFailure() {

        LoginRequest request = new LoginRequest("Parker234@aol.com", "wrongPassword");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
    }

    @Test
    void login_wrongEmailValidPassword_returnsFailure() {

        LoginRequest request = new LoginRequest("wrong@email.com", "test");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());
    }

    @Test
    void login_wrongPassword_returnsFailure() {
        LoginRequest request = new LoginRequest("user@email.com", "wrong");

        LoginResponse response = authService.login(request);

        assertFalse(response.isSuccess());
    }

    /**
     * Tests that register(...) returns a RegisterResponse with success=true and the
     * correct message for a valid request.
     * 
     * Logic: Since the current implementation of register(...) does not perform any
     * actual registration logic, we can simply verify that it returns a
     * RegisterResponse with success=true and the expected message for any valid
     * RegisterRequest. We will create a RegisterRequest with sample user details,
     * call the register(...) method, and assert that the response is not null, has
     * success=true, and contains the correct message.
     * Parameters: firstName, lastName, email, password, address, and ccId in
     * RegisterRequest.
     * Expected Output: A RegisterResponse object with success=true and
     * message="User registered successfully".
     * 
     */
    @Test
    void register_validRequest_returnsSuccessTrueAndCorrectMessage() {
        // email not taken, insert returns a new customerId
        when(customerRepository.emailExists("hailah@email.com")).thenReturn(false);
        when(customerRepository.insertCustomerWithCreditCard(any())).thenReturn(42);

        RegisterRequest request = new RegisterRequest(
                "Hailah",
                "Saad",
                "hailah@email.com",
                "1234",
                "Hittin",
                "0011 2233 4455 6677",
                "2026-12-31", "Hailah", "Saad");

        RegisterResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertTrue(response.isSuccess());
    }

    @Test
    void register_withEmptyEmail_shouldReturnFailure() {
        RegisterRequest rquest = new RegisterRequest(
                "Hailah",
                "Saad",
                "", // ← email empty
                "1234",
                "Hittin",
                "0011 2233 4455 6677",
                "2026-12-31", "Hailah", "Saad");

        RegisterResponse response = authService.register(rquest);

        // Expect failure 
        assertFalse(response.isSuccess());
        assertEquals("All fields are required", response.getMessage());

    }
}