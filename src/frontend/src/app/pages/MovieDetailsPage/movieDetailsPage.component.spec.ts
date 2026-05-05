import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { MovieDetailsPageComponent } from './movieDetailsPage';
import { MovieService } from '../../core/services/MovieService';
import { CartService } from '../../core/services/CartService';

import { MovieDto } from '../../core/models/MovieDto';
import { CartDto } from '../../core/models/CartDto';

describe('MovieDetailsPageComponent', () => {
  let component: MovieDetailsPageComponent;
  let fixture: ComponentFixture<MovieDetailsPageComponent>;

  let movieService: { getMovieById: ReturnType<typeof vi.fn> };
  let cartService: { addItem: ReturnType<typeof vi.fn> };

  let mockMovie: MovieDto;
  let mockCart: CartDto;

  async function createComponentWithMovieId(movieId: string | null) {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsPageComponent, RouterTestingModule],
      providers: [
        { provide: MovieService, useValue: movieService },
        { provide: CartService, useValue: cartService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap(movieId ? { movieId } : {})),
          snapshot: {                              
            queryParamMap: convertToParamMap({}),
          },
        },
       },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsPageComponent);
    component = fixture.componentInstance;
  }

 beforeEach(() => {
  vi.clearAllMocks(); 

  movieService = { getMovieById: vi.fn() };
  cartService = { addItem: vi.fn() };

  movieService.getMovieById.mockReturnValue(of(null)); 

    mockMovie = {
      id: 'tt0413051',
      title: 'No Longer My Twin',
      year: 2002,
      director: 'Robert G. Christie',
      rating: 1.4,
      genres: [{ id: 16, name: 'Mystery' }],
      stars: [
        { id: 'nm1636964', name: 'Phantom Artsy', birthYear: 1970 },
        { id: 'nm1382753', name: 'Maria Angelucci', birthYear: 1975 },
      ],
    };

    mockCart = {} as CartDto;

  // Stub global alert to prevent actual popups during tests
    vi.stubGlobal('alert', vi.fn());
  });

  it('should load movie on init from route', async () => {
    movieService.getMovieById.mockReturnValue(of(mockMovie));

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    expect(movieService.getMovieById).toHaveBeenCalledWith('tt0413051');

    const m = component.movie();
    expect(m).toBeTruthy();
    expect(m!.id).toBe(mockMovie.id);
    expect(m!.title).toBe(mockMovie.title);
    expect(m!.year).toBe(mockMovie.year);
    expect(m!.director).toBe(mockMovie.director);
    expect(m!.rating).toBe(mockMovie.rating);
    expect(m!.genres).toEqual(mockMovie.genres);
    expect(m!.stars).toEqual(mockMovie.stars);

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should set error when movieId is missing from route', async () => {
    await createComponentWithMovieId(null);
    fixture.detectChanges();

    expect(movieService.getMovieById).not.toHaveBeenCalled();
    expect(component.movie()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('Missing movieId in route.');
  });

  it('should set error when getMovieById fails', async () => {
    movieService.getMovieById.mockReturnValue(
      throwError(() => new Error('Backend failed'))
    );

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    expect(movieService.getMovieById).toHaveBeenCalledWith('tt0413051');
    expect(component.movie()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('Backend failed');
  });

  it('should increase quantity', async () => {
    await createComponentWithMovieId('tt0413051');

    component.quantity.set(1);
    component.incQty();

    expect(component.quantity()).toBe(2);
  });

  it('should decrease quantity when greater than 1', async () => {
    await createComponentWithMovieId('tt0413051');

    component.quantity.set(2);
    component.decQty();

    expect(component.quantity()).toBe(1);
  });

  it('should not decrease quantity below 1', async () => {
    await createComponentWithMovieId('tt0413051');

    component.quantity.set(1);
    component.decQty();

    expect(component.quantity()).toBe(1);
  });

  it('should set quantity from valid numeric input', async () => {
    await createComponentWithMovieId('tt0413051');

    component.onQtyInput('5');

    expect(component.quantity()).toBe(5);
  });

  it('should floor decimal quantity input', async () => {
    await createComponentWithMovieId('tt0413051');

    component.onQtyInput('3.9');

    expect(component.quantity()).toBe(3);
  });

  it('should reset quantity to 1 when input is invalid text', async () => {
    await createComponentWithMovieId('tt0413051');

    component.quantity.set(4);
    component.onQtyInput('abc');

    expect(component.quantity()).toBe(1);
  });

  it('should reset quantity to 1 when input is zero', async () => {
    await createComponentWithMovieId('tt0413051');

    component.quantity.set(4);
    component.onQtyInput('0');

    expect(component.quantity()).toBe(1);
  });

  it('should reset quantity to 1 when input is negative', async () => {
    await createComponentWithMovieId('tt0413051');

    component.quantity.set(4);
    component.onQtyInput('-2');

    expect(component.quantity()).toBe(1);
  });

  it('should call CartService.addItem with correct data', async () => {
    movieService.getMovieById.mockReturnValue(of(mockMovie));
    cartService.addItem.mockReturnValue(of(mockCart));

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    component.quantity.set(3);
    component.addToCart();

    expect(cartService.addItem).toHaveBeenCalledWith({
      movieId: mockMovie.id,
      title: mockMovie.title,
      quantity: 3,
    });
    expect(component.cartError()).toBeNull();
  });

  it('should not call addItem if movie is null', async () => {
    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    component.movie.set(null);
    component.addToCart();

    expect(cartService.addItem).not.toHaveBeenCalled();
  });

  it('should set cartResult on successful addToCart', async () => {
    movieService.getMovieById.mockReturnValue(of(mockMovie));
    cartService.addItem.mockReturnValue(of(mockCart));

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    component.addToCart();

    expect(cartService.addItem).toHaveBeenCalled();
    expect(component.cartResult()).toBe(mockCart);
    expect(component.cartError()).toBeNull();
  });

  it('should set cartError when addToCart fails', async () => {
    movieService.getMovieById.mockReturnValue(of(mockMovie));
    cartService.addItem.mockReturnValue(
      throwError(() => new Error('Add to cart failed'))
    );

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    component.addToCart();

    expect(cartService.addItem).toHaveBeenCalled();
    expect(component.cartResult()).toBeNull();
    expect(component.cartError()).toBe('Add to cart failed');
  });

  it('should format rating correctly', async () => {
    await createComponentWithMovieId('tt0413051');

    expect(component.formatRating(4.2)).toBe('4.2/10');
    expect(component.formatRating(0)).toBe('0/10');
  });

  it('should return dash when rating is null or undefined', async () => {
    await createComponentWithMovieId('tt0413051');

    expect(component.formatRating(null)).toBe('-');
    expect(component.formatRating(undefined)).toBe('-');
  });

  it('should render stars as hyperlinks with correct names', async () => {
    movieService.getMovieById.mockReturnValue(of(mockMovie));

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    const starList = fixture.nativeElement.querySelector('ul');
    expect(starList).toBeTruthy();

    const starLinks: NodeListOf<HTMLAnchorElement> = starList.querySelectorAll('a');
    expect(starLinks.length).toBe(mockMovie.stars.length);


    const renderedTexts = Array.from(starLinks).map(a =>
      (a.textContent ?? '').trim()
    );

    for (const s of mockMovie.stars) {
      expect(renderedTexts.some(t => t.includes(s.name))).toBe(true);
    }
  });

  it('should show no-stars message when stars list is empty', async () => {
    movieService.getMovieById.mockReturnValue(
      of({
        ...mockMovie,
        stars: [],
      })
    );

    await createComponentWithMovieId('tt0413051');
    fixture.detectChanges();

    const allElements = Array.from(
    fixture.nativeElement.querySelectorAll('div, span, p')
    );
    const noStarsMsg = allElements.find(
      (element) => (element as HTMLElement).textContent?.trim() === 'No stars found.'
    );
    expect(noStarsMsg).toBeTruthy();
  });
  
 it('should navigate back to previous page (search case)', async () => {
  const backSpy = vi.spyOn(window.history, 'back');

  Object.defineProperty(window.history, 'length', {
    value: 2,
    configurable: true,
  });

  component.back();

  expect(backSpy).toHaveBeenCalled();
});

it('should navigate back to previous page (genre case)', async () => {
  const backSpy = vi.spyOn(window.history, 'back');

  Object.defineProperty(window.history, 'length', {
    value: 2,
    configurable: true,
  });

  component.back();

  expect(backSpy).toHaveBeenCalled();
});

it('should navigate back to previous page (letter case)', async () => {
  const backSpy = vi.spyOn(window.history, 'back');

  Object.defineProperty(window.history, 'length', {
    value: 2,
    configurable: true,
  });

  component.back();

  expect(backSpy).toHaveBeenCalled();
});

it('should navigate back to previous page (browse case)', async () => {
  const backSpy = vi.spyOn(window.history, 'back');

  Object.defineProperty(window.history, 'length', {
    value: 2,
    configurable: true,
  });

  component.back();

  expect(backSpy).toHaveBeenCalled();
});
});