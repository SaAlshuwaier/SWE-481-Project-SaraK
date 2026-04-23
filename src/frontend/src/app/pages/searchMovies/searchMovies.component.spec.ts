import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchMoviesComponent } from './searchMovies.component';
import { MovieService } from '../../core/services/MovieService';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('SearchMoviesComponent', () => {
  let component: SearchMoviesComponent;
  let fixture: ComponentFixture<SearchMoviesComponent>;

  const movieServiceMock = {
    searchMovies: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  async function createComponentWithQueryParams(queryParams: any) {
    await TestBed.configureTestingModule({
      imports: [SearchMoviesComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams },
            queryParams: of(queryParams),
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
      page: '1',
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

  it('nextPage should increment page and update URL when hasNext is true', async () => {
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
      page: '1',
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

    component.nextPage();

    expect(component.page).toBe(2);
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('previousPage should decrement page and update URL when hasPrev is true', async () => {
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
      page: '2',
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

    component.previousPage();

    expect(component.page).toBe(1);
    expect(routerMock.navigate).toHaveBeenCalled();
  });
});