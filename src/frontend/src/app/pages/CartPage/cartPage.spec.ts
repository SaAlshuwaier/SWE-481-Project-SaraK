import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      getCart: vi.fn(),
      addItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [{ provide: CartService, useValue: cartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
  });

  it('should render 4 cart action buttons', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const buttons = el.querySelectorAll('button');
    expect(buttons.length).toBe(4);

    const texts = Array.from(buttons).map(b => (b.textContent ?? '').trim());
    expect(texts.some(t => t.includes('GET Cart'))).toBe(true);
    expect(texts.some(t => t.includes('ADD Item'))).toBe(true);
    expect(texts.some(t => t.includes('UPDATE Item'))).toBe(true);
    expect(texts.some(t => t.includes('DELETE Item'))).toBe(true);
  });

  it('should call getCart and render items list', () => {
    const mockCart = {
      items: [{ movieId: 'tt0000001', title: 'Dummy Movie', quantity: 2 }],
      totalQuantity: 2,
    } as any;

    cartService.getCart.mockReturnValue(of(mockCart));

    fixture.detectChanges();

    component.loadCart();
    fixture.detectChanges();

    expect(cartService.getCart).toHaveBeenCalledTimes(1);

    const c = component.cart();
    expect(c).toBeTruthy();

    expect('items' in (c as any)).toBeTruthy();
    expect(Array.isArray((c as any).items)).toBeTruthy();
    expect((c as any).items[0].movieId).toBe('tt0000001');

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.item-list li').length).toBe(1);
    expect(el.textContent).toContain('Dummy Movie');
  });

  it('should call addItem with current signals', () => {
    const mockCart = {
      items: [{ movieId: 'tt9999999', title: 'Added', quantity: 1 }],
      totalQuantity: 1,
    } as any;

    cartService.addItem.mockReturnValue(of(mockCart));

    fixture.detectChanges();

    component.setMovieId('tt9999999');
    component.setTitle('Added');
    component.setQuantity(1);

    component.addItem();
    fixture.detectChanges();

    expect(cartService.addItem).toHaveBeenCalledWith({
      movieId: 'tt9999999',
      title: 'Added',
      quantity: 1,
    });

    expect(component.cart()).toBeTruthy();
    expect((component.cart() as any).totalQuantity).toBe(1);
  });
});