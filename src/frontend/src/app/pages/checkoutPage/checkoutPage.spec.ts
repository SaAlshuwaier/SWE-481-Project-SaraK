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

  it('should render error box when service errors', () => {
    checkoutService.checkout.mockReturnValue(
      throwError(() => new Error('Payment rejected'))
    );

    fixture.detectChanges();

    component.setFirstName('Neil');
    component.setLastName('Kope');
    component.setCardNumber('0000-0000-0000-0000');
    component.setExpiration('2008/12/01');

    component.submit();
    fixture.detectChanges();

    expect(checkoutService.checkout).toHaveBeenCalledTimes(1);

      const el = fixture.nativeElement as HTMLElement;
      const allAlerts = Array.from(el.querySelectorAll<HTMLElement>('.alert'));
      const errorAlert = allAlerts.find(
        (alert) => alert.textContent?.includes('Checkout failed')
      );

      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Checkout failed');
  });
});