import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchMoviesComponent } from './searchMovies.component';
import { MovieService } from '../../core/services/MovieService';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('SearchMoviesComponent', () => {
  let component: SearchMoviesComponent;
  let fixture: ComponentFixture<SearchMoviesComponent>;

  // Mock MovieService with the REAL signature (6 params)
  const movieServiceMock = {
    searchMovies: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    const activatedRouteMock = {
      queryParams: of({
        title: 'alpha',
        year: '2005',
        director: 'david',
        star: 'tom',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [SearchMoviesComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideRouter([]),
        //{ provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchMoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should read queryParams and call MovieService.searchMovies with correct params', () => {
    // IMPORTANT: return Observable so .subscribe() does not crash
    movieServiceMock.searchMovies.mockReturnValue(
      of({
        page: 1,
        pageSize: 20,
        totalResults: 0,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
        movies: [],
      })
    );

    fixture.detectChanges(); // triggers ngOnInit

    expect(movieServiceMock.searchMovies).toHaveBeenCalledWith(
      'alpha',   // title
      2005,      // year (number)
      'david',   // director
      'tom',     // star
      1,         // page
      20         // pageSize
    );
  });

  // it('should fallback to dummy filter on service error', () => {
  //   movieServiceMock.searchMovies.mockReturnValue(throwError(() => new Error('fail')));

  //   fixture.detectChanges(); // triggers ngOnInit

  //   expect(component.movies.length).toBeGreaterThan(0);
  //   expect(component.pageState).toBeTruthy();
  // });

  it('nextPage should increment page when hasNext is true and reload results', () => {
    movieServiceMock.searchMovies.mockReturnValue(
      of({
        page: 1,
        pageSize: 20,
        totalResults: 2,
        totalPages: 2,
        hasPrev: false,
        hasNext: true,
        movies: [],
      })
    );

    fixture.detectChanges(); // init

    // Make component think there is a next page
    component.pageState = {
      page: 1,
      pageSize: 20,
      totalResults: 2,
      totalPages: 2,
      hasPrev: false,
      hasNext: true,
      movies: [],
    } as any;

    // When nextPage triggers loadSearchResults, we must return Observable too
    movieServiceMock.searchMovies.mockReturnValue(
      of({
        page: 2,
        pageSize: 20,
        totalResults: 2,
        totalPages: 2,
        hasPrev: true,
        hasNext: false,
        movies: [],
      })
    );

    component.nextPage();

    expect(component.page).toBe(2);
    expect(movieServiceMock.searchMovies).toHaveBeenCalled();
  });

  it('previousPage should decrement page when hasPrev is true and reload results', () => {
    movieServiceMock.searchMovies.mockReturnValue(
      of({
        page: 2,
        pageSize: 20,
        totalResults: 2,
        totalPages: 2,
        hasPrev: true,
        hasNext: false,
        movies: [],
      })
    );

    fixture.detectChanges(); // init

    component.page = 2;
    component.pageState = {
      page: 2,
      pageSize: 20,
      totalResults: 2,
      totalPages: 2,
      hasPrev: true,
      hasNext: false,
      movies: [],
    } as any;

    movieServiceMock.searchMovies.mockReturnValue(
      of({
        page: 1,
        pageSize: 20,
        totalResults: 2,
        totalPages: 2,
        hasPrev: false,
        hasNext: true,
        movies: [],
      })
    );

    component.previousPage();

    expect(component.page).toBe(1);
    expect(movieServiceMock.searchMovies).toHaveBeenCalled();
  });

  it('backToHome should navigate to /home', () => {
  const router = TestBed.inject(Router);
  const navSpy = vi.spyOn(router, 'navigate');

  component.backToHome();

  expect(navSpy).toHaveBeenCalledWith(['/home']);
});
});