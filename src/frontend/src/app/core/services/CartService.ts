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
   * Get the current cart
   * Logic:
   * - Retrieves: current cart for the user from backend
   * - Returns: CartDto (items + totalQuantity)
   *
   * @request GET /api/cart
   * @return {
   *   "items": [
   *     {
   *       "movieId": "tt123",
   *       "title": "Movie Title",
   *       "quantity": 2
   *     }
   *   ],
   *   "totalQuantity": 2
   * }
   */
  getCart(): Observable<CartDto> {
    return this.http.get<CartDto>(
      `${environment.backendUrl}/api/cart`,
      //{ withCredentials: true }
    );
  }


/**
 * Add an item to the cart
 *
 *
 * Logic:
 *  - Receives: CartItemDto (movieId, title, quantity)
 *  - Movie does NOT already exist in cart
 *  - A new CartItem is created
 *  - Item is added to the cart list
 *  - totalQuantity is updated
 *  - Returns: updated CartDto 

 * @request POST /api/cart/addItem
 * @param request
 * {
 *    "movieId": "tt123",
 *    "title": "Movie Title",
 *    "quantity": 1
 * }
 *
 * @return
 * {
 *    "items": [
 *       {
 *          "movieId": "tt123",
 *          "title": "Movie Title",
 *          "quantity": 1
 *       }
 *    ],
 *    "totalQuantity": 1
 * }
 */
  addItem(item: CartItemDto): Observable<CartDto> {
    return this.http.post<CartDto>(
      `${environment.backendUrl}/api/cart/addItem`,
      item,                        // body sent to backend
      //{ withCredentials: true }    // send session cookie
    );
  }



  /**
   * Update quantity of an item in the cart
   * Logic:
   * - Receives: movieId + quantity 
   * - Updates: quantity for that specific movie
   * - Returns: updated CartDto
   *
   * @request PATCH /api/cart/updateItem/{movieId}
   * @param movieId example: "tt0000001"
   * @param quantity example request body: { "quantity": 3 }
   * @return {
   *   "items": [
   *     {
   *       "movieId": "tt0000001",
   *       "title": "Movie Title",
   *       "quantity": 3
   *     }
   *   ],
   *   "totalQuantity": 3
   * }
   */
  updateItem(movieId: string, quantity: number): Observable<CartDto> {
    return this.http.patch<CartDto>(
      `${environment.backendUrl}/api/cart/updateItem/${movieId}`,
      { quantity },                // request body
      //{ withCredentials: true }
    );
  }



  /**
   * Delete an item from the cart
   * Logic:
   * - Receives: movieId 
   * - Deletes: that item completely from the cart
   * - Returns: updated CartDto
   *
   * @request DELETE /api/cart/deleteItem/{movieId}
   * @param movieId example: "tt123"
   * @return {
   *   "items": [],
   *   "totalQuantity": 0
   * }
   */
  deleteItem(movieId: string): Observable<CartDto> {
    return this.http.delete<CartDto>(
      `${environment.backendUrl}/api/cart/deleteItem/${movieId}`,
      //{ withCredentials: true }
    );
  }
}
