import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { GenreService } from '../../core/services/GenreService';

describe('HomeComponent (Home Navigation)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  let genreService: {
    getAllGenres: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    genreService = {
      getAllGenres: vi.fn().mockReturnValue(
        of([
          { id: 1, name: 'Comedy' },
          { id: 2, name: 'Action' }
        ])
      )
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: GenreService, useValue: genreService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should load genres and titleFilters from mock response', () => {
    expect(component.genres.length).toBeGreaterThan(0);
    expect(component.titleFilters.length).toBe(36);
  });

  it('goToSearchResults should navigate to /movies/search with correct query params', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.filters.title = 'matrix';
    component.filters.director = 'nolan';
    component.filters.star = 'keanu';

    component.goToSearchResults();

    expect(navSpy).toHaveBeenCalledWith(['/movies/search'], {
      queryParams: {
        title: 'matrix',
        director: 'nolan',
        star: 'keanu',
      },
    });
  });

  it('onClear should reset filters', () => {
    component.filters.title = 'x';
    component.filters.year = '1994';

    component.onClear();

    expect(component.filters).toEqual({
      title: '',
      year: '',
      director: '',
      star: '',
    });
  });

  it('goToBrowseGenre should navigate to /movies/genre/:genreId with genreName query', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.goToBrowseGenre({ id: 1, name: 'Comedy' });

    expect(navSpy).toHaveBeenCalledWith(['/movies/genre', 1], {
      queryParams: { genreName: 'Comedy' },
    });
  });

  it('goToBrowseTitle should navigate to /movies?letter=A', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.goToBrowseTitle('A');

    expect(navSpy).toHaveBeenCalledWith(['/movies'], {
      queryParams: { letter: 'A' },
    });
  });
  it('isSearchDisabled should be true when all filters are empty', () => {
  component.filters = { title: '', year: '', director: '', star: '' };
  expect(component.isSearchDisabled).toBe(true);
});

it('isSearchDisabled should be false when at least one filter has value', () => {
  component.filters.title = 'matrix';
  expect(component.isSearchDisabled).toBe(false);
});

it('goToSearchResults should not navigate and should set searchError when all filters are empty', () => {
  const navSpy = vi.spyOn(router, 'navigate');

  component.filters = { title: '', year: '', director: '', star: '' };
  component.goToSearchResults();

  expect(navSpy).not.toHaveBeenCalled();
  expect(component.searchError).toBe('Please enter at least one search field.');
});

it('goToSearchResults should not navigate and should set yearError when year is invalid', () => {
  const navSpy = vi.spyOn(router, 'navigate');

  component.filters.year = 'abcd';
  component.goToSearchResults();

  expect(navSpy).not.toHaveBeenCalled();
  expect(component.yearError).toBe('Year must be a valid number.');
});
it('onClear should reset filters and clear errors', () => {
  component.filters = {
    title: 'x',
    year: '1994',
    director: 'y',
    star: 'z',
  };
  component.yearError = 'Year must be a valid number.';
  component.searchError = 'Please enter at least one search field.';

  component.onClear();

  expect(component.filters).toEqual({
    title: '',
    year: '',
    director: '',
    star: '',
  });
  expect(component.yearError).toBe('');
  expect(component.searchError).toBe('');
});
});