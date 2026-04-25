import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowseMoviesComponent } from './browseMovies.component';
import { MovieService } from '../../core/services/MovieService';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MovieDto } from '../../core/models/MovieDto';
import { MoviesPageStateDto } from '../../core/models/MoviesPageStateDto';

describe('BrowseMoviesComponent', () => {

  let component: BrowseMoviesComponent;
  let fixture: ComponentFixture<BrowseMoviesComponent>;

  let movieService: {
    browseMoviesByGenre: ReturnType<typeof vi.fn>;
    browseMoviesByFirstLetter: ReturnType<typeof vi.fn>;
    searchMovies: ReturnType<typeof vi.fn>;
  };

  let moviesMock: MovieDto[];
  let mockMoviesPageState: MoviesPageStateDto;

  beforeEach(async () => {

    movieService = {
      browseMoviesByGenre: vi.fn(),
      browseMoviesByFirstLetter: vi.fn(),
      searchMovies: vi.fn()
    };

    moviesMock = [
      {
        id: 'tt1',
        title: 'Zeta',
        year: 2020,
        director: 'Nolan',
        rating: 4.2,
        genres: [{ id: 1, name: 'Action' }],
        stars: [{ id: 's1', name: 'Tom', birthYear: 1980 }]
      },
      {
        id: 'tt2',
        title: 'Alpha',
        year: 2018,
        director: 'Spielberg',
        rating: 6.2,
        genres: [{ id: 2, name: 'Drama' }],
        stars: [{ id: 's2', name: 'Brad', birthYear: 1990 }]
      }
    ];

    mockMoviesPageState = {
      page: 1,
      pageSize: 20,
      totalResults: 2,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      movies: moviesMock
    };

    movieService.browseMoviesByGenre.mockReturnValue(of(mockMoviesPageState));
movieService.browseMoviesByFirstLetter.mockReturnValue(of(mockMoviesPageState));
movieService.searchMovies.mockReturnValue(of(mockMoviesPageState));

    await TestBed.configureTestingModule({
      imports: [
        BrowseMoviesComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: MovieService, useValue: movieService },
 {
  provide: ActivatedRoute,
  useValue: {
    snapshot: {
      paramMap: convertToParamMap({}),
      queryParams: {}
    },
    queryParams: of({})
  }
}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseMoviesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // trigger ngOnInit safely
  });

  it('should go to next page when hasNext is true', () => {
      component.page = 1;
      component.pageState.hasNext = true;

      component.nextPage();

      expect(component.page).toBe(2);
    });

  it('should go to next page when hasNext is false', () => {
    component.page = 1;
    component.pageState.hasNext = false;

    component.nextPage();

    expect(component.page).toBe(1);
  });

  it('should go to previous page when hasPrev is true', () => {
    component.page = 2;
    component.pageState.hasPrev = true;

    component.previousPage();

    expect(component.page).toBe(1);
  });

  it('should not go to previous page when hasPrev is false', () => {
    component.page = 1;
    component.pageState.hasPrev = false;

    component.previousPage();

    expect(component.pageState.page).toBe(1);
  });

  it('should sort movies by title ascending', () => {

    component.movies = moviesMock;
    component.sortBy = 'Title';
    component.order = 'asc';

    component.applySorting();

    expect(component.sortedMovies[0].title).toBe('Alpha');
  });

  it('should sort movies by title descending', () => {

    component.movies = moviesMock;
    component.sortBy = 'Title';
    component.order = 'desc';

    component.applySorting();

    expect(component.sortedMovies[0].title).toBe('Zeta');
  });

  it('should sort movies by rating ascending', () => {
    component.movies = moviesMock;
    component.sortBy = 'Rating';
    component.order = 'asc';

    component.applySorting();

    expect(component.sortedMovies[0].rating).toBe(4.2);
  });

  it('should sort movies by rating descending', () => {
    component.movies = moviesMock;
    component.sortBy = 'Rating';
    component.order = 'desc';

    component.applySorting();

    expect(component.sortedMovies[0].rating).toBe(6.2);
  });

  it('should update sortBy and reapply sorting', () => {
    vi.spyOn(component, 'applySorting');

    const event = {
      target: {value: 'Rating'}
    } as unknown as Event;

    component.onSortChange(event);

    expect(component.sortBy).toBe('Rating');
    expect(component.applySorting).toHaveBeenCalled();
  });

  it('should update order and reapply sorting', () => {
    vi.spyOn(component, 'applySorting');

    const event = {
      target: {value: 'desc'}
    } as unknown as Event;

    component.onOrderChange(event);

    expect(component.order).toBe('desc');
    expect(component.applySorting).toHaveBeenCalled();
  });

  


  it('should show genre names as links', () => {
    component.movies = moviesMock;
    component.sortedMovies = moviesMock;

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.genre-browseMovies-link');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should show movie title names as link', () => {
    component.movies = moviesMock;
    component.sortedMovies = moviesMock;

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.movie-title-browseMovies-link');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should show star names as links', () => {
    component.movies = moviesMock;
    component.sortedMovies = moviesMock;

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.star-browseMovies-link');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should reset page and call service with new pageSize', () => {
    component.page = 5;

    movieService.browseMoviesByGenre.mockReturnValue(of(mockMoviesPageState));

    const event = {
      target: { value: '50' }
    } as unknown as Event;

    (component['route'].snapshot as any).paramMap = convertToParamMap({ genreId: '1' });
(component['route'].snapshot as any).queryParams = { genreName: 'Action' };

    component.onPageSizeChange(event);

    expect(component.page).toBe(1);
   
   
  });

  it('should update pageState, movies and call applySorting', () => {
    const sortingSpy = vi.spyOn(component, 'applySorting');

    component['updateState'](mockMoviesPageState);

    expect(component.pageState).toEqual(mockMoviesPageState);
    expect(component.movies).toEqual(moviesMock);
    expect(sortingSpy).toHaveBeenCalled();
  });
});
