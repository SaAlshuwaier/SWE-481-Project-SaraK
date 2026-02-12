import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartDto, CartItemDto } from '../models/CartDto';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

// This tells Angular:
// "Create only ONE instance of this service in the whole app"
@Injectable({ providedIn: 'root' })
export class CartService {

  // Constructor injection:
  // Angular automatically gives us HttpClient here
  // so we can make HTTP calls
  constructor(private http: HttpClient) {}



  /**
   * GET /api/cart

  * Purpose:
   *   Retrieve the current cart from backend.
   *
   * Returns:
   *   Observable<CartDto>
   *
   * Explanation:
   *   <CartDto> means:
   *   "The backend will return JSON shaped like CartDto."
   *
   *   withCredentials: true
   *   means:
   *   "Send session cookies with this request"
   *
   *   This is REQUIRED because our cart is stored in session.
   */
  getCart(): Observable<CartDto> {
    return this.http.get<CartDto>(
      `${environment.backendUrl}/api/cart`,
      //{ withCredentials: true }
    );
  }



  /**
  * POST /api/cart/addItem

  * Purpose:
   *   Add a new item to cart.
   *
   * Parameters:
   *   item: CartItemDto
   *   {
   *     movieId: string,
   *     title: string,
   *     quantity: number
   *   }
   *
   * Returns:
   *   Updated CartDto
   */
  addItem(item: CartItemDto): Observable<CartDto> {
    return this.http.post<CartDto>(
      `${environment.backendUrl}/api/cart/addItem`,
      item,                        // body sent to backend
      //{ withCredentials: true }    // send session cookie
    );
  }



  /**
   * POST /api/cart/updateItem/{movieId}

  * Purpose:
   *   Update quantity of an existing item.
   *
   * Parameters:
   *   movieId -> passed in URL path
   *   quantity -> passed in request body
   *
   * Example:
   *   POST /api/cart/updateItem/tt0000001
   *   Body:
   *   { "quantity": 3 }
   *
   * Returns:
   *   Updated CartDto
   */
  updateItem(movieId: string, quantity: number): Observable<CartDto> {
    return this.http.post<CartDto>(
      `${environment.backendUrl}/api/cart/updateItem/${movieId}`,
      { quantity },                // request body
      //{ withCredentials: true }
    );
  }



  /**
   * DELETE /api/cart/deleteItem/{movieId}

  * Purpose:
   *   Remove an item completely from cart.
   *
   * Parameters:
   *   movieId -> passed in URL
   *
   * Returns:
   *   Updated CartDto
   */
  deleteItem(movieId: string): Observable<CartDto> {
    return this.http.delete<CartDto>(
      `${environment.backendUrl}/api/cart/deleteItem/${movieId}`,
      //{ withCredentials: true }
    );
  }
}
