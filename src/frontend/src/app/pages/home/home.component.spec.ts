import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
=======
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
>>>>>>> db7453d (Final updates)

describe('HomeComponent (Home Navigation)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      imports: [HomeComponent], // standalone
      providers: [
        provideRouter([]), //  provides Router + ActivatedRoute needed by routerLink
      ],
=======
      imports: [HomeComponent], // Standalone component
>>>>>>> db7453d (Final updates)
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

<<<<<<< HEAD
    fixture.detectChanges(); // triggers ngOnInit
=======
    fixture.detectChanges(); // triggers ngOnInit (mock mapping)
>>>>>>> db7453d (Final updates)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

<<<<<<< HEAD
  it('should load genres and titleFilters from mock response', () => {
    expect(component.genres.length).toBeGreaterThan(0);
    expect(component.titleFilters.length).toBe(36);
  });

  it('goToSearchResults should navigate to /movies with correct query params', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.filters.title = 'matrix';
=======
  /* =========================
     Mock Mapping Tests
  ========================= */

  it('should load genres from mock response on init', () => {
    expect(component.genres.length).toBeGreaterThan(0);
    expect(component.genres).toContain('Comedy');
  });

  it('should load title filters (0-9, A-Z) from mock response on init', () => {
    expect(component.titleFilters.length).toBe(36);
    expect(component.titleFilters).toContain('0');
    expect(component.titleFilters).toContain('A');
    expect(component.titleFilters).toContain('Z');
  });

  it('should render genre buttons in the UI (generated from genres[])', () => {
    // Genre section buttons are the first outline-secondary buttons group after the search card
    // We'll query all buttons and ensure at least one genre exists
    const genreButtons = fixture.debugElement.queryAll(By.css('button.btn.btn-sm.btn-outline-secondary'));
    expect(genreButtons.length).toBeGreaterThan(0);

    // sanity: one of them should show "Comedy"
    const hasComedy = genreButtons.some(b => (b.nativeElement as HTMLButtonElement).textContent?.trim() === 'Comedy');
    expect(hasComedy).toBeTrue();
  });

  /* =========================
     Navigation Tests (Router)
  ========================= */

  it('goToSearchResults should navigate to /movies with only non-empty params', () => {
    const navSpy = spyOn(router, 'navigate');

    component.filters.title = 'matrix';
    component.filters.year = '';
>>>>>>> db7453d (Final updates)
    component.filters.director = 'nolan';
    component.filters.star = 'keanu';

    component.goToSearchResults();

<<<<<<< HEAD
    expect(navSpy).toHaveBeenCalledWith(['/movies/search'], {
      queryParams: {
        title: 'matrix',
        director: 'nolan',
        star: 'keanu', 
      },
=======
    expect(navSpy).toHaveBeenCalledWith(['/movies'], {
      queryParams: {
        title: 'matrix',
        director: 'nolan',
        starName: 'keanu',
      }
>>>>>>> db7453d (Final updates)
    });
  });

  it('onClear should reset filters', () => {
    component.filters.title = 'x';
<<<<<<< HEAD
    component.filters.year = '1994';

=======
    component.filters.year = '1999';
>>>>>>> db7453d (Final updates)
    component.onClear();

    expect(component.filters).toEqual({
      title: '',
      year: '',
      director: '',
<<<<<<< HEAD
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

  it('goToBrowseTitle should navigate to /movies', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.goToBrowseTitle('A');

    expect(navSpy).toHaveBeenCalledWith(['/movies']);
=======
      star: ''
    });
  });

  it('goToBrowseGenre should navigate to /movies with genre param', () => {
    const navSpy = spyOn(router, 'navigate');

    component.goToBrowseGenre('Comedy');

    expect(navSpy).toHaveBeenCalledWith(['/movies'], {
      queryParams: { genre: 'Comedy' }
    });
  });

  it('goToBrowseTitle should navigate to /movies with startsWith param', () => {
    const navSpy = spyOn(router, 'navigate');

    component.goToBrowseTitle('A');

    expect(navSpy).toHaveBeenCalledWith(['/movies'], {
      queryParams: { startsWith: 'A' }
    });
>>>>>>> db7453d (Final updates)
  });
});