import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthDto } from '../models/AuthDto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}


  login(body: AuthDto): Observable<AuthDto> {
    return this.http.post<AuthDto>(
      `${environment.backendUrl}/api/auth/login`,
      body
    );
  }

  // POST /api/auth/logout
  logout(): Observable<AuthDto> {
    return this.http.post<AuthDto>(
      `${environment.backendUrl}/api/auth/logout`,
      {}
    );
  }
}
