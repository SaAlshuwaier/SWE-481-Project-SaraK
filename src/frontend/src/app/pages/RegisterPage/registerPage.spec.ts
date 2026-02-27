import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RegisterPageComponent } from './registerPage';
import { AuthService } from '../../core/services/AuthService';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  let authService: {
    register: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
  });

  it('should render inputs + create account button', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const inputs = el.querySelectorAll('input');
    expect(inputs.length).toBe(6);

    const btn = el.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect((btn.textContent ?? '').trim()).toContain('Create Account');
  });

  it('should call AuthService.register and render success message', () => {
    authService.register.mockReturnValue(
      of({ success: true, message: 'User registered successfully', customerId: 12 } as any)
    );

    fixture.detectChanges();

    component.setFirstName('Jana');
    component.setLastName('Alshreef');
    component.setEmail('test@uci.edu');
    component.setPassword('test123');
    component.setAddress('Riyadh');
    component.setCcId('1111222233334444');

    component.submit();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledTimes(1);
    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'Jana',
      lastName: 'Alshreef',
      email: 'test@uci.edu',
      password: 'test123',
      address: 'Riyadh',
      ccId: '1111222233334444',
    });

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.ok-box')?.textContent).toContain('User registered successfully');
    expect(el.textContent).toContain('ID: 12');
  });
});