import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CartService } from './CartService';
import { environment } from '../../../environment/environment';
import { CartDto, CartItemDto } from '../models/CartDto';

describe('CartService (HTTP Mock Tests)', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /api/cart', () => {
    const mockItem: CartItemDto = {
      movieId: 'tt123',
      title: 'Movie Title',
      quantity: 2,
    };

    const mockCart: CartDto = {
      items: [mockItem],
      totalQuantity: 2,
    };

    service.getCart().subscribe((res) => {
      // key existence
      expect('items' in res).toBeTruthy();
      expect('totalQuantity' in res).toBeTruthy();

      // type validation
      expect(Array.isArray(res.items)).toBeTruthy();
      expect(typeof res.totalQuantity).toBe('number');

      // value validation
      expect(res.items.length).toBe(1);
      expect(res.items[0].movieId).toBe('tt123');
      expect(res.items[0].quantity).toBe(2);
      expect(res.totalQuantity).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/cart`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should POST /api/cart/addItem', () => {
    const body: CartItemDto = {
      movieId: 'tt999',
      title: 'New Movie',
      quantity: 1,
    };

    const mockCart: CartDto = {
      items: [body],
      totalQuantity: 1,
    };

    service.addItem(body).subscribe((res) => {
      expect(res.items.length).toBe(1);
      expect(res.items[0].movieId).toBe('tt999');
      expect(res.totalQuantity).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/cart/addItem`);
    expect(req.request.method).toBe('POST');

    // request body checks
    expect(req.request.body.movieId).toBe('tt999');
    expect(req.request.body.title).toBe('New Movie');
    expect(req.request.body.quantity).toBe(1);

    req.flush(mockCart);
  });

  it('should PATCH /api/cart/updateItem/{movieId}', () => {
    const movieId = 'tt123';
    const quantity = 5;

    const mockCart: CartDto = {
      items: [{ movieId, title: 'Movie Title', quantity }],
      totalQuantity: 5,
    };

    service.updateItem(movieId, quantity).subscribe((res) => {
      expect(res.items[0].movieId).toBe('tt123');
      expect(res.items[0].quantity).toBe(5);
      expect(res.totalQuantity).toBe(5);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/cart/updateItem/${movieId}`);
    expect(req.request.method).toBe('PATCH');

    // request body check
    expect(req.request.body.quantity).toBe(5);

    req.flush(mockCart);
  });

  it('should DELETE /api/cart/deleteItem/{movieId}', () => {
    const movieId = 'tt123';

    const mockCart: CartDto = {
      items: [],
      totalQuantity: 0,
    };

    service.deleteItem(movieId).subscribe((res) => {
      expect(Array.isArray(res.items)).toBeTruthy();
      expect(res.items.length).toBe(0);
      expect(res.totalQuantity).toBe(0);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/cart/deleteItem/${movieId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockCart);
  });
});