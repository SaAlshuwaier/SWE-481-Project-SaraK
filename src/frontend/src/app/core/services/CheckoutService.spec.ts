import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CheckoutService } from './CheckoutService';
import { environment } from '../../../environment/environment';
import { CheckoutDto } from '../models/CheckoutDto';


describe('CheckoutService (HTTP Mock Tests)', () => {
  let service: CheckoutService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CheckoutService],
    });

    service = TestBed.inject(CheckoutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should POST /api/checkout', () => {
    const body = {
  firstName: 'lulu',
  lastName: 'hamad',
  cardNumber: '1234567890123456',
  expiration: '12/2026',
};

    const mockRes: CheckoutDto = {
      success: true,
      message: 'Transaction succeeded (mock)',
    };

    service.checkout(body).subscribe((res) => {
      expect('success' in res).toBeTruthy();
      expect('message' in res).toBeTruthy();

      expect(typeof res.success).toBe('boolean');
      expect(typeof res.message).toBe('string');

      expect(res.success).toBe(true);
      expect(res.message).toContain('Transaction');
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/checkout`);
    expect(req.request.method).toBe('POST');

    expect(req.request.body.firstName).toBe('lulu');
    expect(req.request.body.lastName).toBe('hamad');

    expect(req.request.body.cardNumber).toBe('1234567890123456');
    expect(req.request.body.expiration).toBe('12/2026');

    req.flush(mockRes);
  });
});