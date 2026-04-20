import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { provideRouter } from '@angular/router';
 
import { HomeComponent } from './home.component';
import { GenreService } from '../../core/services/GenreService';
import { MovieService } from '../../core/services/MovieService';
 
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
 
  let genreService: {
	getAllGenres: ReturnType<typeof vi.fn>;
  };
 
  let movieService: {
	getTitleSuggestions: ReturnType<typeof vi.fn>;
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
 
	movieService = {
  	getTitleSuggestions: vi.fn().mockReturnValue(of([]))
	};
 
	await TestBed.configureTestingModule({
  	imports: [HomeComponent],
  	providers: [
    	provideRouter([]),
    	{ provide: GenreService, useValue: genreService },
    	{ provide: MovieService, useValue: movieService },
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
    	starName: 'keanu',
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
 
  it('onTitleInputChange should clear suggestions and hide dropdown when input is shorter than 3 chars', () => {
	component.titleSuggestions = [{ id: 'tt1', title: 'Inception' }];
	component.showSuggestions = true;
 
	component.onTitleInputChange('in');
 
	expect(component.filters.title).toBe('in');
	expect(component.titleSuggestions).toEqual([]);
	expect(component.showSuggestions).toBe(false);
	expect(movieService.getTitleSuggestions).not.toHaveBeenCalled();
  });
 
  it('onTitleInputChange should fetch suggestions after debounce when input is valid', async () => {
	movieService.getTitleSuggestions.mockReturnValue(
  	of([{ id: '1', title: 'Inception' }])
	);
 
	component.onTitleInputChange('ince');
 
	await new Promise(resolve => setTimeout(resolve, 350));
 
	expect(movieService.getTitleSuggestions).toHaveBeenCalledWith('ince');
	expect(component.titleSuggestions.length).toBe(1);
	expect(component.showSuggestions).toBe(true);
  });
 
  it('onTitleInputChange should trim the query before requesting suggestions', async () => {
	movieService.getTitleSuggestions.mockReturnValue(
  	of([{ id: 'tt1375666', title: 'Inception' }])
	);
 
	component.onTitleInputChange('   ince   ');
 
	await new Promise(resolve => setTimeout(resolve, 350));
 
	expect(movieService.getTitleSuggestions).toHaveBeenCalledWith('ince');
	expect(component.showSuggestions).toBe(true);
  });
 
  it('should hide suggestions when autocomplete returns empty array', async () => {
	movieService.getTitleSuggestions.mockReturnValue(of([]));
 
	component.onTitleInputChange('xyz');
 
	await new Promise(resolve => setTimeout(resolve, 350));
 
	expect(movieService.getTitleSuggestions).toHaveBeenCalledWith('xyz');
	expect(component.titleSuggestions).toEqual([]);
	expect(component.showSuggestions).toBe(false);
  });
 
  it('should handle autocomplete service error and keep suggestions hidden', async () => {
	movieService.getTitleSuggestions.mockReturnValue(
  	throwError(() => new Error('Autocomplete failed'))
	);
 
	component.onTitleInputChange('ince');
 
	await new Promise(resolve => setTimeout(resolve, 350));
 
	expect(movieService.getTitleSuggestions).toHaveBeenCalledWith('ince');
	expect(component.titleSuggestions).toEqual([]);
	expect(component.showSuggestions).toBe(false);
  });
 
  it('selectSuggestion should fill title, clear suggestions, and navigate to movie details', () => {
	const navSpy = vi.spyOn(router, 'navigate');
 
	component.titleSuggestions = [
  	{ id: 'tt1375666', title: 'Inception' }
	];
	component.showSuggestions = true;
 
	component.selectSuggestion({ id: 'tt1375666', title: 'Inception' });
 
	expect(component.filters.title).toBe('Inception');
	expect(component.titleSuggestions).toEqual([]);
	expect(component.showSuggestions).toBe(false);
    expect(navSpy).toHaveBeenCalledWith(['/movies', 'tt1375666']);
  });
 
  it('goToSearchResults should hide suggestions before navigating', () => {
	const navSpy = vi.spyOn(router, 'navigate');
 
	component.showSuggestions = true;
	component.filters.title = 'Inception';
 
	component.goToSearchResults();
 
	expect(component.showSuggestions).toBe(false);
	expect(navSpy).toHaveBeenCalled();
  });
 
  it('should reload genres on NavigationEnd to /home', () => {
	const loadSpy = vi.spyOn(component as any, 'loadGenres');
	const events$ = new Subject<any>();
 
	Object.defineProperty(router, 'events', {
  	get: () => events$.asObservable(),
	});
 
	component.ngOnDestroy();
	component.ngOnInit();
 
	events$.next(new NavigationEnd(1, '/home', '/home'));
 
	expect(loadSpy).toHaveBeenCalled();
  });
 
  it('ngOnDestroy should unsubscribe from subscriptions', () => {
	const routerUnsubSpy = vi.spyOn((component as any).routerSub!, 'unsubscribe');
	const titleUnsubSpy = vi.spyOn((component as any).titleInputSub!, 'unsubscribe');
 
	component.ngOnDestroy();
 
	expect(routerUnsubSpy).toHaveBeenCalled();
	expect(titleUnsubSpy).toHaveBeenCalled();
  });
});
