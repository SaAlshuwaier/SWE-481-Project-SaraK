import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { LoginRequestDto } from '../models/Auth/LoginRequestDto';
import { LoginResponseDto } from '../models/Auth/LoginResponseDto';
import { LogoutResponseDto } from '../models/Auth/LogoutResponseDto';
import { RegisterRequestDto } from '../models/Auth/RegisterRequestDto';
import { RegisterResponseDto } from '../models/Auth/RegisterResponseDto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }
  /**
     * Login API
     *
     * Logic:
     * - Sends: email + password to backend
     * - Backend validates credentials (Phase 2 is mock success)
     * - Returns: LoginResponseDto (message + success)
     *
     * @request POST /api/auth/login
     * @param body {
     *   "email": "user@email.com",
     *   "password": "123456"
     * }
     *
     * @return {
     *   "message": "Login successful",
     *   "success": true
     * }
     */

  login(body: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${environment.backendUrl}/api/auth/login`,
      body,
      { withCredentials: true }
    );
  }
  /**
    * Logout API
    *
    * Logic:
    * - Sends: nothing (just calls logout endpoint)
    * - Backend ends the current session (Phase 2 is mock success)
    * - Returns: LogoutResponseDto (message + success)
    *
    * @request POST /api/auth/logout
    * @param body {} (empty)
    *
    * @return {
    *   "message": "Logout successful",
    *   "success": true
    * }
    */

  logout(): Observable<LogoutResponseDto> {
    return this.http.post<LogoutResponseDto>(
      `${environment.backendUrl}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  /**
     * Register API (Create Account)
     *
     * Logic:
     * - Sends: user information from signup form
     * - Backend creates a new customer account (Phase 2 mock success)
     *
     * Phase 3 (Real Implementation):
     *   - Backend will insert new customer into customers table
     *   - Validate that email is unique
     *   - Validate ccId exists in creditcards table
     *
     * Returns:
     * - success = true  -> account created successfully
     * - success = false -> registration failed
     *
     * @request POST /api/auth/register
     *
     * @param body {
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
  register(body: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(
      `${environment.backendUrl}/api/auth/register`,
      body
    );
  }
}
