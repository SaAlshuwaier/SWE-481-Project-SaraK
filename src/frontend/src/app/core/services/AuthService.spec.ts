import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './AuthService';
import { environment } from '../../../environment/environment';
import { LoginRequestDto } from '../models/Auth/LoginRequestDto';
import { LoginResponseDto } from '../models/Auth/LoginResponseDto';
import { LogoutResponseDto } from '../models/Auth/LogoutResponseDto';
import { RegisterRequestDto } from '../models/Auth/RegisterRequestDto';
import { RegisterResponseDto } from '../models/Auth/RegisterResponseDto';

describe('AuthService (HTTP Mock Tests)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should POST /api/auth/login', () => {
    const body: LoginRequestDto = {
      email: 'test@uci.edu',
      password: 'test123',
    };

    const mockRes: LoginResponseDto = {
      message: 'Login successful',
      success: true,
      customerId: 872020,
    };

    service.login(body).subscribe((res) => {
  
      expect('message' in res).toBeTruthy();
      expect('success' in res).toBeTruthy();

      expect(typeof res.message).toBe('string');
      expect(typeof res.success).toBe('boolean'); 

      expect(res.message).toBe('Login successful');
      expect(res.success).toBe(true);
      expect(res.customerId).toBe(872020);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/auth/login`);
    expect(req.request.method).toBe('POST');

    // request body checks (MATCH input)
    expect(req.request.body.email).toBe(body.email);
    expect(req.request.body.password).toBe(body.password);

    req.flush(mockRes);
  });

  it('should POST /api/auth/logout', () => {
    const mockRes: LogoutResponseDto = {
      message: 'Logout successful',
      success: true,
    };

    service.logout().subscribe((res) => {

      expect('message' in res).toBeTruthy();
      expect('success' in res).toBeTruthy();

      expect(typeof res.message).toBe('string');
      expect(typeof res.success).toBe('boolean');

      expect(res.message).toBe('Logout successful');
      expect(res.success).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/auth/logout`);
    expect(req.request.method).toBe('POST');

    // request body check
    expect(req.request.body).toEqual({});

    req.flush(mockRes);
  });

  it('should POST /api/auth/register', () => {
    const body: RegisterRequestDto = {
      firstName: 'Jana',
      lastName: 'Alshreef',
      email: 'test@uci.edu',
      password: 'test123',
      address: 'Riyadh',
      ccNumber: '0011 2233 4455 6677',
      ccExpiration:'2026-12-31',
      ccFirstName: 'Jana',
      ccLastName: 'Alshreef',
    };

    const mockRes: RegisterResponseDto = {
      message: 'User registered successfully',
      customerId: 12,
      success: true,
    };

    service.register(body).subscribe((res) => {
     
      expect('message' in res).toBeTruthy();
      expect('success' in res).toBeTruthy();

      
      expect(typeof res.message).toBe('string');
      expect(typeof res.success).toBe('boolean');

      
      expect(res.message).toBe('User registered successfully');
      expect(res.success).toBe(true);
      expect(res.customerId).toBe(12);
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.email).toBe('test@uci.edu');
    expect(req.request.body.ccNumber).toBe('0011 2233 4455 6677');
    req.flush(mockRes);
  });
});