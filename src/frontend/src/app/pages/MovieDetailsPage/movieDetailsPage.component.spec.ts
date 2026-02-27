import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

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

  // mocks created in beforeEach 
  let mockMovie: MovieDto;
  let mockCart: CartDto;

  beforeEach(async () => {

    // create mock services
    movieService = {
      getMovieById: vi.fn(),
    };

    cartService = {
      addItem: vi.fn(),
    };

    // create mock movie
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

    await TestBed.configureTestingModule({
      imports: [
        MovieDetailsPageComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: MovieService, useValue: movieService },
        { provide: CartService, useValue: cartService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ movieId: 'tt0413051' })),
          },
        },
      ],
    }).compileComponents();

    // create component instance
    fixture = TestBed.createComponent(MovieDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load movie on init from route (check each key)', () => {
    // Arrange
    movieService.getMovieById.mockReturnValue(of(mockMovie));

    // Act
    fixture.detectChanges(); // triggers ngOnInit

    // Assert - service called
    expect(movieService.getMovieById).toHaveBeenCalledWith('tt0413051');

    // Assert - each key separately
    const m = component.movie();
    expect(m).toBeTruthy();

    expect(m!.id).toBe(mockMovie.id);
    expect(m!.title).toBe(mockMovie.title);
    expect(m!.year).toBe(mockMovie.year);
    expect(m!.director).toBe(mockMovie.director);
    expect(m!.rating).toBe(mockMovie.rating);

    expect(m!.genres.length).toBe(1);
    expect(m!.genres[0].id).toBe(mockMovie.genres[0].id);
    expect(m!.genres[0].name).toBe(mockMovie.genres[0].name);

    expect(m!.stars.length).toBe(mockMovie.stars.length);

    // check all stars (id, name, birthYear)
    for (let i = 0; i < mockMovie.stars.length; i++) {
      expect(m!.stars[i].id).toBe(mockMovie.stars[i].id);
      expect(m!.stars[i].name).toBe(mockMovie.stars[i].name);
      expect(m!.stars[i].birthYear).toBe(mockMovie.stars[i].birthYear);
    }
  });

  it('should increase quantity', () => {
    // Arrange
    component.quantity.set(1);
    // Act
    component.incQty();
    // Assert
    expect(component.quantity()).toBe(2);
  });

  it('should decrease quantity when greater than 1', () => {
    component.quantity.set(2);
    component.decQty();
    expect(component.quantity()).toBe(1);
  });

  it('should not decrease quantity below 1', () => {
    component.quantity.set(1);
    component.decQty();
    expect(component.quantity()).toBe(1);
  });

  it('should call CartService.addItem with correct data', () => {
    // Arrange
    movieService.getMovieById.mockReturnValue(of(mockMovie));
    cartService.addItem.mockReturnValue(of(mockCart));

    // Act
    fixture.detectChanges(); // loads movie in ngOnInit
    component.quantity.set(3);
    component.addToCart();

    // Assert
    expect(cartService.addItem).toHaveBeenCalledWith({
      movieId: mockMovie.id,
      title: mockMovie.title,
      quantity: 3,
    });
  });

  it('should render stars as hyperlinks (anchor + correct names)', () => {
    // Arrange
    movieService.getMovieById.mockReturnValue(of(mockMovie));

    // Act
    fixture.detectChanges();

    // MovieDetailsPage.html stars list class = link-list
    const container = fixture.nativeElement.querySelector('.link-list');
    expect(container).toBeTruthy();

    const starLinks: NodeListOf<HTMLAnchorElement> = container.querySelectorAll('a');

    // 1) correct count
    expect(starLinks.length).toBe(mockMovie.stars.length);

    // 2) anchor
    expect(starLinks[0].tagName).toBe('A');

    // 3) correct text based on mock
    const renderedTexts = Array.from(starLinks).map(a => (a.textContent ?? '').trim());
    for (const s of mockMovie.stars) {
      expect(renderedTexts.some(t => t.includes(String(s.name)))).toBe(true);
    }
  });

});