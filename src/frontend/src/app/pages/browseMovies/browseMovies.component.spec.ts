import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseMoviesComponent } from './browseMovies.component';
import {MovieService} from '../../core/services/MovieService';
import { of } from 'rxjs';
import {MovieDto} from '../../core/models/MovieDto';
import {MoviesPageStateDto} from '../../core/models/MoviesPageStateDto';

describe('BrowseMoviesComponent', () => {
  let component: BrowseMoviesComponent; // real instance of browseMovies.component.ts
  let fixture: ComponentFixture<BrowseMoviesComponent>; // Angular and tests middleman
  let movieService: jasmine.SpyObj<MovieService>; // mock service
  let moviesMock: MovieDto[];
  let mockMoviesPageState: MoviesPageStateDto;

  beforeEach(async () => {
    // create mock for MoviesService
    movieService = jasmine.createSpyObj('MovieService', [
      'browseMoviesByGenre',
      'browseByFirstLetter',
      'searchMovies'
    ]);

    moviesMock = [
      {
        id:"t44211",
        title: 'Zeta',
        year: 2020,
        director: 'Nolan',
        rating: 4.2,
        stars: [{id:"123", name: 'Tom' , birthYear: 1980}, { id:"123",  name: 'Adam', birthYear:1990}],
        genres: [{ id:10,name:'Action'}, {id:11,name:'Fiction'}]
      },
      {
        id:"t99886",
        title: 'Alpha',
        year: 2018,
        rating: 6.2,
        director: 'Spielberg',
        stars: [{id:"123", name: 'Brad' , birthYear: 1980}, { id:"123",  name: 'mark', birthYear:1990}],
        genres: [{ id:10,name:'Drama'}, {id:11,name:'Fantasy'}]
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

    // build module to be tested
    await TestBed.configureTestingModule({
      declarations: [BrowseMoviesComponent],
      providers: [
        {provide: MovieService, useValue: movieService}
      ]
    }).compileComponents();

    // create component instance
    fixture = TestBed.createComponent(BrowseMoviesComponent);
    component = fixture.componentInstance;
  });

  it('should go to next page when hasNext is true', () => {
    //Arrange
    component.pageState.page = 1;
    component.pageState.hasNext = true;
    //Act
    component.nextPage();
    //Assert
    expect(component.pageState.page).toBe(2);
  });

  it('should not go to next page when hasNext is false', () => {

    component.pageState.page = 1;
    component.pageState.hasNext = false;

    component.nextPage();

    expect(component.pageState.page).toBe(1);
  });

  it('should go to next page when hasPrev is true', () => {

    component.pageState.page = 2;
    component.pageState.hasPrev = true;

    component.nextPage();

    expect(component.pageState.page).toBe(1);
  });

  it('should not go to next page when hasPrev is false', () => {

    component.pageState.page = 2;
    component.pageState.hasPrev = false;

    component.nextPage();

    expect(component.pageState.page).toBe(2);
  });

  it('should load movies into pageState on init', () => {

    movieService.browseMoviesByGenre.and.returnValue(of(mockMoviesPageState));
    fixture.detectChanges(); // triggers ngOnInit, which subscribe the component to the service

    expect(component.pageState.movies.length).toBe(1);
    expect(movieService.browseMoviesByGenre).toHaveBeenCalledWith(1, 1, 20);//check is called
  });

  it('should sort movies by title ascending', () => {

    component.movies = moviesMock;
    component.sortBy = 'title';
    component.order = 'asc';

    component.applySorting();

    expect(component.sortedMovies[0].title).toBe('Alpha');
    expect(component.sortedMovies[1].title).toBe('Zeta');
  });

  it('should sort movies by title descending', () => {

    component.movies = moviesMock;
    component.sortBy = 'title';
    component.order = 'desc';

    component.applySorting();

    expect(component.sortedMovies[0].title).toBe('Zeta');
  });

  it('should sort movies by year ascending', () => {
    component.movies = moviesMock;
    component.sortBy = 'year';
    component.order = 'asc';

    component.applySorting();

    expect(component.sortedMovies[0].year).toBe(2018);
  });

  it('should sort movies by director name ascending', () => {
    component.movies = moviesMock;
    component.sortBy = 'director';
    component.order = 'asc';

    component.applySorting();

    expect(component.sortedMovies[0].director).toBe('Nolan');
  });

  it('should sort movies by director name descending', () => {
    component.movies = moviesMock;
    component.sortBy = 'director';
    component.order = 'desc';

    component.applySorting();

    expect(component.sortedMovies[0].director).toBe('Spielberg');
  });

  it('should sort movies by first alphabetic star name', () => {
    component.movies = moviesMock;
    component.sortBy = 'star';
    component.order = 'asc';

    component.applySorting();

    // movie[0] stars: ['Tom', 'Adam'] consider Adam
    // movie[1] stars: ['Brad']
    expect(component.sortedMovies[0].stars![0].name).toBe('Tom');
  });

  it('should update sortBy and reapply sorting', () => {
    spyOn(component, 'applySorting');

    const event = {
      target: { value: 'year' }
    } as unknown as Event;

    component.onSortChange(event);

    expect(component.sortBy).toBe('year');
    expect(component.applySorting).toHaveBeenCalled();
  });

  it('should update order and reapply sorting', () => {
    spyOn(component, 'applySorting');

    const event = {
      target: { value: 'desc' }
    } as unknown as Event;

    component.onOrderChange(event);

    expect(component.order).toBe('desc');
    expect(component.applySorting).toHaveBeenCalled();
  });

  it('should render stars as hyperlinks', () => {
    component.movies = moviesMock;
    component.sortedMovies = moviesMock;
    fixture.detectChanges();

    const starLinks = fixture.nativeElement.querySelectorAll('a.star-link');

    expect(starLinks.length).toBeGreaterThan(0);
    expect(starLinks[0].tagName).toBe('A');
  });

  it('should render genres as hyperlinks', () => {
    component.movies = moviesMock;
    component.sortedMovies = moviesMock;
    fixture.detectChanges();

    const genreLinks = fixture.nativeElement.querySelectorAll('a.genre-link');

    expect(genreLinks.length).toBe(2);
    expect(genreLinks[0].textContent).toContain('Action');
  });
});
