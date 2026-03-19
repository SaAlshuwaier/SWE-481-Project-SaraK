import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutRequest {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiration: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:8080/api/checkout';

  constructor(private http: HttpClient) {}

  checkout(data: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.apiUrl, data, {
      withCredentials: true
    });
  }
}