import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginPageComponent } from './loginPage';
import { AuthService } from '../../core/services/AuthService';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authService: {
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should render inputs + login button', async () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const inputs = el.querySelectorAll('input');
    expect(inputs.length).toBe(2);

    const btn = el.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect((btn.textContent ?? '').trim()).toContain('Login');
  });

  it('should call AuthService.login on submit and render success message', async () => {

    fixture.detectChanges();

    component.onEmailInput('test@uci.edu');
    component.onPasswordInput('test123');

    component.submit();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@uci.edu',
      password: 'test123',
    });

    const res = component.result();
    expect(res).toBeTruthy();
    expect(typeof (res as any).success).toBe('boolean');
    expect(typeof (res as any).message).toBe('string');
    expect((res as any).message).toBe('Login successful');

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.ok-box')?.textContent).toContain('Login successful');
  });

  it('should render error box when service errors', async () => {

    fixture.detectChanges();

    component.onEmailInput('wrong@uci.edu');
    component.onPasswordInput('wrong');

    component.submit();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.err-box')?.textContent).toContain('Bad credentials');
  });
});