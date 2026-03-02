import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CheckoutPageComponent } from './checkoutPage';
import { CheckoutService } from '../../core/services/CheckoutService';

describe('CheckoutPageComponent', () => {
  let component: CheckoutPageComponent;
  let fixture: ComponentFixture<CheckoutPageComponent>;

  let checkoutService: { checkout: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    checkoutService = { checkout: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [{ provide: CheckoutService, useValue: checkoutService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
  });

  it('should render inputs + pay button', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const inputs = el.querySelectorAll('input');
    expect(inputs.length).toBe(4);

    const btn = el.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect((btn.textContent ?? '').trim()).toContain('Pay');
  });

  it('should call CheckoutService.checkout and render success message', () => {
    checkoutService.checkout.mockReturnValue(
      of({ success: true, message: 'Transaction succeeded (mock)' } as any)
    );

    fixture.detectChanges();

    component.setFirstName('Neil');
    component.setLastName('Kope');
    component.setCardNumber('5232-4634-7322-2511');
    component.setExpiration('2008/12/01');

    component.submit();
    fixture.detectChanges();

    expect(checkoutService.checkout).toHaveBeenCalledTimes(1);
    expect(checkoutService.checkout).toHaveBeenCalledWith({
      firstName: 'Neil',
      lastName: 'Kope',
      cardNumber: '5232-4634-7322-2511',
      expiration: '2008/12/01',
    });

    expect(component.result()?.success).toBe(true);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="checkout-success"]')?.textContent)
      .toContain('Transaction succeeded');
  });

  it('should render error box when service errors', () => {

    fixture.detectChanges();

    component.setFirstName('Neil');
    component.setLastName('Kope');
    component.setCardNumber('0000-0000-0000-0000');
    component.setExpiration('2008/12/01');

    component.submit();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="checkout-error"]')?.textContent)
      .toContain('Payment rejected');
  });
});