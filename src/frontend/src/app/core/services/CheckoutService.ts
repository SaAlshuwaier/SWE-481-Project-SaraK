import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CheckoutDto } from '../models/CheckoutDto';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(private http: HttpClient) {}

  // POST /api/checkout
  checkout(body: CheckoutDto): Observable<CheckoutDto> {
    return this.http.post<CheckoutDto>(
      `${environment.backendUrl}/api/checkout`,
      body
    );
  }
}
