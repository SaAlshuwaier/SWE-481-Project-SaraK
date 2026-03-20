import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoginPageComponent } from './loginPage';
import { AuthService } from '../../core/services/AuthService';
import { Router } from '@angular/router';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authService: {
    login: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = { login: vi.fn() };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should render inputs + login button', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('input').length).toBe(2);
    expect(el.querySelector('button')?.textContent).toContain('Login');
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
    expect(router.navigate).toHaveBeenCalledWith(['/home']);

    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.ok-box')?.textContent).toContain('Login successful');
  });

  it('should show error box for invalid email format', () => {
    component.onEmailInput('bad-email');
    component.onPasswordInput('123');

    component.submit();
    fixture.detectChanges();

    expect(component.error()).toBe('Invalid email format');

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.err-box')?.textContent)
      .toContain('Invalid email format');
  });

  it('should block submit on invalid email', () => {
    component.onEmailInput('bad-email');
    component.onPasswordInput('123');

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.error()).toBe('Invalid email format');
  });

  it('should block submit on empty password', () => {
    component.onEmailInput('test@uci.edu');
    component.onPasswordInput('');

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.error()).toBe('Password required');
  });
});