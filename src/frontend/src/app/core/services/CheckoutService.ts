import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CheckoutDto } from '../models/CheckoutDto';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(private http: HttpClient) {}
/**
   * Checkout Payment Request
   *
   * Logic:
   * - Sends payment info from frontend form
   * - Backend validates and returns success/failure
   *
   * @request POST /api/checkout
   *
   * @param body {
   *   "firstName": "Jana",
   *   "lastName": "Alshreef",
   *   "cardNumber": "1234567890123456",
   *   "expiration": "12/2026"
   * }
   *
   * @return {
   *   "success": true,
   *   "message": "Transaction succeeded (mock)"
   * }
   */
  // POST /api/checkout
  checkout(body: CheckoutDto): Observable<CheckoutDto> {
    return this.http.post<CheckoutDto>(
      `${environment.backendUrl}/api/checkout`,
      body
    );
  }
}
