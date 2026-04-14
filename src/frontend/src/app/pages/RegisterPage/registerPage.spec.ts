import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
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
      imports: [RegisterPageComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
  });

  it('should render inputs + create account button', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const inputs = el.querySelectorAll('input');
    expect(inputs.length).toBe(10);

    const btn = el.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect((btn.textContent ?? '').trim()).toContain('Create Account');
  });

it('should call AuthService.register with correct body', () => {
  authService.register.mockReturnValue(of({
    message: 'User registered successfully',
    customerId: 12,
    success: true,
  }));
    fixture.detectChanges();

    component.setFirstName('Jana');
    component.setLastName('Alshreef');
    component.setEmail('test2@uci.edu');
    component.setPassword('test123');
    component.setAddress('Riyadh');
    component.setCcNumber('0011 2233 4455 6677');
    component.setCcExpiration('2026-12-31');
    component.setCcFirstName('Jana');
    component.setCcLastName('Alshreef');
    component.setConfirmPassword('test123'); 

    component.submit();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledTimes(1);
    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'Jana',
      lastName: 'Alshreef',
      email: 'test2@uci.edu',
      password: 'test123',
      address: 'Riyadh',
      ccNumber:'0011 2233 4455 6677',
      ccExpiration:'2026-12-31',
      ccFirstName:'Jana',
      ccLastName:'Alshreef',
    });
  });
});