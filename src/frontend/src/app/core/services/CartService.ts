import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

export interface CartItem {
  movieId: string;
  title: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl, {
      withCredentials: true
    });
  }

  addItem(item: CartItem): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/addItem`, item, {
      withCredentials: true
    });
  }

  updateItem(movieId: string, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiUrl}/updateItem/${movieId}`, {
      quantity: quantity
    }, {
      withCredentials: true
    });
  }

  deleteItem(movieId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/deleteItem/${movieId}`, {
      withCredentials: true
    });
  }
}