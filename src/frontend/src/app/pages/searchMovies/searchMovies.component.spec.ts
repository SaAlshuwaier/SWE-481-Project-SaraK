import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchMoviesComponent } from './searchMovies.component';
import { MovieService } from '../../core/services/MovieService';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('SearchMoviesComponent', () => {
  let component: SearchMoviesComponent;
  let fixture: ComponentFixture<SearchMoviesComponent>;

  const movieServiceMock = {
    searchMovies: vi.fn(),
  };

  async function createComponentWithQueryParams(queryParams: any) {
    await TestBed.configureTestingModule({
      imports: [SearchMoviesComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchMoviesComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ngOnInit should read queryParams and call MovieService.searchMovies with correct params', async () => {
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

    await createComponentWithQueryParams({
      title: 'alpha',
      year: '2005',
      director: 'david',
      star: 'tom',
    });

    fixture.detectChanges();

    expect(movieServiceMock.searchMovies).toHaveBeenCalledWith(
      'alpha',
      2005,
      'david',
      'tom',
      1,
      20
    );
  });

  it('should not call searchMovies and should show error when year is not a valid number', async () => {
    await createComponentWithQueryParams({
      title: 'alpha',
      year: 'bgb',
      director: 'david',
      star: 'tom',
    });

    fixture.detectChanges();

    expect(movieServiceMock.searchMovies).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('Year');
    expect(component.movies()).toEqual([]);
  });

  it('should not call searchMovies and should show error when year is outside valid range', async () => {
    await createComponentWithQueryParams({
      title: 'alpha',
      year: '3000',
      director: 'david',
      star: 'tom',
    });

    fixture.detectChanges();

    expect(movieServiceMock.searchMovies).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('Year');
    expect(component.movies()).toEqual([]);
  });

  it('nextPage should increment page when hasNext is true and reload results', async () => {
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

    await createComponentWithQueryParams({
      title: 'alpha',
      year: '2005',
      director: 'david',
      star: 'tom',
    });

    fixture.detectChanges();

    component.pageState.set({
      page: 1,
      pageSize: 20,
      totalResults: 2,
      totalPages: 2,
      hasPrev: false,
      hasNext: true,
      movies: [],
    });

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

  it('previousPage should decrement page when hasPrev is true and reload results', async () => {
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

    await createComponentWithQueryParams({
      title: 'alpha',
      year: '2005',
      director: 'david',
      star: 'tom',
    });

    fixture.detectChanges();

    component.page = 2;
    component.pageState.set({
      page: 2,
      pageSize: 20,
      totalResults: 2,
      totalPages: 2,
      hasPrev: true,
      hasNext: false,
      movies: [],
    });

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


});
