import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CartPageComponent } from './cartPage';
import { CartService } from '../../core/services/CartService';

describe('CartPageComponent', () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;

  let cartService: {
    getCart: ReturnType<typeof vi.fn>;
    addItem: ReturnType<typeof vi.fn>;
    updateItem: ReturnType<typeof vi.fn>;
    deleteItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    cartService = {
    getCart: vi.fn().mockReturnValue(of({ items: [], totalQuantity: 0 })), 
      addItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartPageComponent, RouterTestingModule],
      providers: [{ provide: CartService, useValue: cartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
  });

it('should render footer actions (Clear Cart, Continue Shopping, Proceed to Checkout) when cart exists', () => {
  cartService.getCart.mockReturnValue(of({
        items: [{ movieId: 'tt1', title: 'Dummy Movie', quantity: 2 }],
        totalQuantity: 2,
    }));
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;

  const buttons = Array.from(el.querySelectorAll('button'));
  const clearBtn    = buttons.find(b => b.textContent?.trim() === 'Clear Cart');
  const continueBtn = buttons.find(b => b.textContent?.trim() === 'Continue Shopping');
  const checkoutBtn = buttons.find(b => b.textContent?.trim() === 'Proceed to Checkout');

  expect(clearBtn).toBeTruthy();
  expect(continueBtn).toBeTruthy();
  expect(checkoutBtn).toBeTruthy();
});

  it('should render Remove button for each cart item', () => {
    cartService.getCart.mockReturnValue(of({
      items: [
          { movieId: 'tt1', title: 'Movie 1', quantity: 1 },
          { movieId: 'tt2', title: 'Movie 2', quantity: 3 },
      ],
      totalQuantity: 4,
  }));

    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;

    const removeButtons = Array.from(el.querySelectorAll('button'))
      .filter(b => (b.textContent ?? '').trim() === 'Remove');

    expect(removeButtons.length).toBe(2);
  });

  it('should call CartService.deleteItem when clicking Remove', () => {
    const afterDelete = {
      items: [],
      totalQuantity: 0,
    } as any;

    cartService.deleteItem.mockReturnValue(of(afterDelete));

    cartService.getCart.mockReturnValue(of({
        items: [{ movieId: 'tt1', title: 'Dummy Movie', quantity: 2 }],
        totalQuantity: 2,
    }));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const removeBtn = Array.from(el.querySelectorAll('button'))
      .find(b => (b.textContent ?? '').trim() === 'Remove') as HTMLButtonElement;

    expect(removeBtn).toBeTruthy();

    removeBtn.click();
    fixture.detectChanges();

    expect(cartService.deleteItem).toHaveBeenCalledTimes(1);
    expect(cartService.deleteItem).toHaveBeenCalledWith('tt1');
  });

  it('should call CartService.updateItem when editing quantity input', () => {
    const afterUpdate = {
      items: [{ movieId: 'tt1', title: 'Movie 1', quantity: 5 }],
      totalQuantity: 5,
    } as any;

    cartService.updateItem.mockReturnValue(of(afterUpdate));

    cartService.getCart.mockReturnValue(of({
        items: [{ movieId: 'tt1', title: 'Dummy Movie', quantity: 2 }],
        totalQuantity: 2,
    }));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const qtyInput = el.querySelector('input[aria-label="Quantity"]') as HTMLInputElement;
    expect(qtyInput).toBeTruthy();

    qtyInput.value = '5';
    qtyInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(cartService.updateItem).toHaveBeenCalledTimes(1);
    expect(cartService.updateItem).toHaveBeenCalledWith('tt1', 5);
  });

  it('should clear cart locally when clicking Clear Cart', () => {
    cartService.getCart.mockReturnValue(of({
        items: [{ movieId: 'tt1', title: 'Dummy Movie', quantity: 2 }],
        totalQuantity: 2,
    }));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const clearBtn = Array.from(el.querySelectorAll('button'))
      .find(b => (b.textContent ?? '').includes('Clear Cart')) as HTMLButtonElement;

    expect(clearBtn).toBeTruthy();

    clearBtn.click();
    fixture.detectChanges();

    const c = component.cart();
    expect(c).toBeTruthy();
    expect((c as any).items.length).toBe(0);
    expect((c as any).totalQuantity).toBe(0);
  });

    it('should disable Proceed to Checkout button when cart is empty', () => {
    cartService.getCart.mockReturnValue(of({
      items: [],
      totalQuantity: 0,
    }));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

  const checkoutBtn = Array.from(el.querySelectorAll('button'))
    .find(b => b.textContent?.trim().includes('Proceed to Checkout')) as HTMLButtonElement;
    expect(checkoutBtn).toBeTruthy();
    expect(checkoutBtn?.getAttribute('disabled')).not.toBeNull();
  });

  it('should enable Proceed to Checkout button when cart has items', () => {
    cartService.getCart.mockReturnValue(of({
      items: [{ movieId: 'tt1', title: 'Dummy Movie', quantity: 2 }],
      totalQuantity: 2,
    }));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const checkoutBtn = Array.from(el.querySelectorAll('button'))
      .find(b => b.textContent?.trim().includes('Proceed to Checkout')) as HTMLButtonElement;
    expect(checkoutBtn).toBeTruthy();
    expect(checkoutBtn?.getAttribute('disabled')).toBeNull();
  });
  
});

