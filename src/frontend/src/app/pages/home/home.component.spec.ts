import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('HomeComponent (Home Navigation)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent], // standalone
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load genres and titleFilters from mock response', () => {
    expect(component.genres.length).toBeGreaterThan(0);
    expect(component.titleFilters.length).toBe(36); // 0-9 + A-Z
  });

  it('goToSearchResults should navigate to /movies/search with correct query params', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.filters.title = 'matrix';
    component.filters.year = '';
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
    component.filters.director = 'y';
    component.filters.star = 'z';

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

    component.goToBrowseGenre('Comedy');

    expect(navSpy).toHaveBeenCalledWith(['/movies/genre', 7], {
      queryParams: { genreName: 'Comedy' },
    });
  });

  it('goToBrowseTitle should navigate to /movies with letter query', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.goToBrowseTitle('A');

    expect(navSpy).toHaveBeenCalledWith(['/movies'], {
      queryParams: { letter: 'A' },
    });
  });
});