import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { LoginPageComponent } from './loginPage';
import { AuthService } from '../../core/services/AuthService';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authService: {
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [
        LoginPageComponent,
        RouterTestingModule 
      ],
      providers: [
        { provide: AuthService, useValue: authService },

        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render inputs + login button', () => {
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('input').length).toBe(2);
    expect(el.querySelector('button')?.textContent).toContain('Sign in');
  });

  it('should login successfully', () => {
    const mockRes = {
      success: true,
      message: 'Login successful',
      customerId: 1,
    };

    authService.login.mockReturnValue(of(mockRes));

    component.onEmailInput('test@uci.edu');
    component.onPasswordInput('test123');

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@uci.edu',
      password: 'test123',
    });

    expect(component.result()?.success).toBe(true);
    expect(component.result()?.message).toBe('Login successful');
  });

  it('should show error for invalid email format', () => {
    component.onEmailInput('bad-email');
    component.onPasswordInput('123');

    component.submit();

    expect(component.error()).toBe('Invalid email format');
  });

  it('should block submit on empty password', () => {
    component.onEmailInput('test@uci.edu');
    component.onPasswordInput('');

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.error()).toBe('Password required');
  });

  it('should handle backend error response', () => {
    authService.login.mockReturnValue(of({
      success: false,
      message: 'Invalid credentials',
    }));

    component.onEmailInput('test@uci.edu');
    component.onPasswordInput('wrong');

    component.submit();

    expect(component.error()).toBe('Invalid credentials');
  });
});