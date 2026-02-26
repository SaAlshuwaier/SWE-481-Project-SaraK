import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseMoviesComponent } from './browseMovies.component';
import {MovieService} from '../../core/services/MovieService';

describe('BrowseMoviesComponent', () => {
  let component: BrowseMoviesComponent; // real instance of browseMovies.component.ts
  let fixture: ComponentFixture<BrowseMoviesComponent>; // Angular and tests middleman
  let movieService: jasmine.SpyObj<MovieService>; // mock service

  beforeEach(async () => {
    // create mock for MoviesService
    movieService = jasmine.createSpyObj('MovieService', [
      'browseMoviesByGenre',
      'browseByFirstLetter',
      'searchMovies'
    ]);

    // build testing module
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
    //Arrange
    component.pageState.page = 1;
    component.pageState.hasNext = false;
    //Act
    component.nextPage();
    //Assert
    expect(component.pageState.page).toBe(1);
  });

  it('should go to next page when hasPrev is true', () => {
    //Arrange
    component.pageState.page = 2;
    component.pageState.hasPrev = true;
    //Act
    component.nextPage();
    //Assert
    expect(component.pageState.page).toBe(1);
  });

  it('should not go to next page when hasPrev is false', () => {
    //Arrange
    component.pageState.page = 2;
    component.pageState.hasPrev = false;
    //Act
    component.nextPage();
    //Assert
    expect(component.pageState.page).toBe(2);
  });

  it('should load movies into pageState on init', () => {
    const MockMoviesPageState = {
      page: 1,
      pageSize: 20,
      totalResults: 2,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      movies: [{title: 'A'}, {title: 'B'}]
    };

    //movieService.browseMoviesByGenre.and.returnValue(of(MockMoviesPageState));
    fixture.detectChanges(); // triggers ngOnInit, which subscribe the component to the service

    expect(component.pageState.movies.length).toBe(2);
    expect(movieService.browseMoviesByGenre).toHaveBeenCalledWith(1, 1, 20);//check is called
  });

});
