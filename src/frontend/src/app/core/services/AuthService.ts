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
  constructor(private http: HttpClient) {}


  login(body: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${environment.backendUrl}/api/auth/login`,
      body
    );
  }

  // POST /api/auth/logout
  logout(): Observable<LogoutResponseDto> {
    return this.http.post<LogoutResponseDto>(
      `${environment.backendUrl}/api/auth/logout`,
      {}
    );
  }

  // POST /api/auth/register
  register(body: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(
      `${environment.backendUrl}/api/auth/register`,
      body
    );
  }
}
