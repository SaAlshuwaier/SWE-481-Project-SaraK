import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from '../services/MovieService';
import { environment } from '../../../environment/environment';
 
describe('MovieService', () => {
	let service: MovieService;
	let httpMock: HttpTestingController;
 
	const baseUrl = environment.backendUrl;
 
	beforeEach(() => {
    	TestBed.configureTestingModule({
        	imports: [HttpClientTestingModule],
        	providers: [MovieService]
    	});
 
    	service = TestBed.inject(MovieService);
    	httpMock = TestBed.inject(HttpTestingController);
	});
 
	afterEach(() => {
    	httpMock.verify(); // Ensures no unexpected requests remain
	});
 
	// ─── searchMovies ─────────────────────────────────────────────────────────
 
 	it('should search movies with no filters and default pagination', () => {
    	const mockResponse = {
        	page: 1,
        	pageSize: 20,
        	totalResults: 1,
        	totalPages: 1,
        	hasPrev: false,
        	hasNext: false,
        	movies: [
            	{
                	id: 'tt0307901',
                	title: '25th Hour',
                	year: 2002,
                	director: 'Spike Lee',
                	rating: 4.3,
                	genres: [{ id: 1, name: 'Drama' }],
                	stars: [{ id: '1', name: 'Edward Norton', birthYear: 1969 }]
            	}
        	]
    	};
 
    	service.searchMovies().subscribe(response => {
        	expect(response.page).toBeDefined();
        	expect(response.pageSize).toBeDefined();
        	expect(response.totalResults).toBeDefined();
        	expect(response.totalPages).toBeDefined();
        	expect(response.hasPrev).toBeDefined();
        	expect(response.hasNext).toBeDefined();
        	expect(response.movies).toBeDefined();
 
        	const movie = response.movies[0];
        	expect(movie.id).toBeDefined();
        	expect(movie.title).toBeDefined();
        	expect(movie.year).toBeDefined();
        	expect(movie.director).toBeDefined();
        	expect(movie.rating).toBeDefined();
        	expect(movie.genres).toBeDefined();
        	expect(movie.stars).toBeDefined();
        	expect(movie.genres[0].id).toBeDefined();
        	expect(movie.genres[0].name).toBeDefined();
        	expect(movie.stars[0].id).toBeDefined();
        	expect(movie.stars[0].name).toBeDefined();
        	expect(movie.stars[0].birthYear).toBeDefined();
 
        	expect(response.totalResults).toBe(1);
        	expect(response.movies.length).toBe(1);
        	expect(movie.title).toBe('25th Hour');
        	expect(movie.year).toBe(2002);
        	expect(movie.director).toBe('Spike Lee');
        	expect(movie.rating).toBe(4.3);
        	expect(movie.genres[0].name).toBe('Drama');
        	expect(movie.stars[0].name).toBe('Edward Norton');
 
        	expect(typeof response.page).toBe('number');
        	expect(typeof response.pageSize).toBe('number');
        	expect(typeof response.totalResults).toBe('number');
        	expect(typeof response.totalPages).toBe('number');
        	expect(typeof response.hasPrev).toBe('boolean');
        	expect(typeof response.hasNext).toBe('boolean');
        	expect(Array.isArray(response.movies)).toBe(true);
 
        	expect(typeof movie.id).toBe('string');
        	expect(typeof movie.title).toBe('string');
        	expect(typeof movie.year).toBe('number');
        	expect(typeof movie.director).toBe('string');
        	expect(typeof movie.rating).toBe('number');
        	expect(Array.isArray(movie.genres)).toBe(true);
        	expect(Array.isArray(movie.stars)).toBe(true);
        	expect(typeof movie.genres[0].id).toBe('number');
        	expect(typeof movie.genres[0].name).toBe('string');
        	expect(typeof movie.stars[0].id).toBe('string');
        	expect(typeof movie.stars[0].name).toBe('string');
        	expect(typeof movie.stars[0].birthYear).toBe('number');
    	});
 
    	const req = httpMock.expectOne(
        	req =>
            	req.url === `${baseUrl}/api/movies/search` &&
            	req.params.get('page') === '1' &&
            	req.params.get('pageSize') === '20' &&
            	!req.params.has('title') &&
            	!req.params.has('year') &&
            	!req.params.has('director') &&
            	!req.params.has('starName')
    	);
    	expect(req.request.method).toBe('GET');
    	req.flush(mockResponse);
	});
 
	it('should search movies with all optional filters including year', () => {
    	const mockResponse = {
        	page: 2,
        	pageSize: 10,
        	totalResults: 2,
        	totalPages: 1,
        	hasPrev: true,
        	hasNext: false,
        	movies: [
            	{
                	id: 'tt0275719',
                	title: 'Tape',
                	year: 2001,
                	director: 'Richard Linklater',
                	rating: 4.1,
                	genres: [{ id: 1, name: 'Drama' }],
                	stars: [{ id: '1', name: 'Ethan Hawke', birthYear: 1970 }]
            	},
            	{
                	id: 'tt0408524',
                	title: 'Bad News Bears',
                	year: 2005,
                	director: 'Richard Linklater',
                	rating: 3.8,
                	genres: [{ id: 2, name: 'Comedy' }],
                	stars: [{ id: '2', name: 'Billy Bob Thornton', birthYear: 1955 }]
            	}
        	]
    	};
 
    	service.searchMovies('Bad', 2005, 'Richard Linklater', 'Ethan Hawke', 2, 10)
        	.subscribe(response => {
            	expect(response.page).toBeDefined();
            	expect(response.pageSize).toBeDefined();
            	expect(response.totalResults).toBeDefined();
            	expect(response.movies).toBeDefined();
 
            	response.movies.forEach(movie => {
                	expect(movie.id).toBeDefined();
                	expect(movie.title).toBeDefined();
                	expect(movie.year).toBeDefined();
                	expect(movie.director).toBeDefined();
                	expect(movie.rating).toBeDefined();
                	expect(movie.genres).toBeDefined();
                	expect(movie.stars).toBeDefined();
            	});
 
            	expect(response.page).toBe(2);
            	expect(response.pageSize).toBe(10);
                expect(response.totalResults).toBe(2);
 
            	expect(typeof response.page).toBe('number');
            	expect(typeof response.pageSize).toBe('number');
            	expect(typeof response.totalResults).toBe('number');
  	          expect(Array.isArray(response.movies)).toBe(true);
 
            	response.movies.forEach(movie => {
                	expect(typeof movie.id).toBe('string');
                	expect(typeof movie.title).toBe('string');
                	expect(typeof movie.year).toBe('number');
                	expect(typeof movie.director).toBe('string');
                	expect(typeof movie.rating).toBe('number');
                	expect(Array.isArray(movie.genres)).toBe(true);
          	      expect(Array.isArray(movie.stars)).toBe(true);
            	});
        	});
 
    	const req = httpMock.expectOne(
        	req =>
            	req.url === `${baseUrl}/api/movies/search` &&
            	req.params.get('title') === 'Bad' &&
            	req.params.get('year') === '2005' &&
            	req.params.get('director') === 'Richard Linklater' &&
            	req.params.get('starName') === 'Ethan Hawke' &&
            	req.params.get('page') === '2' &&
            	req.params.get('pageSize') === '10'
    	);
    	expect(req.request.method).toBe('GET');
    	req.flush(mockResponse);
	});
 
	it('should include year param when year is provided', () => {
    	service.searchMovies(undefined, 2005, undefined, undefined, 1, 20).subscribe();
 
    	const req = httpMock.expectOne(
        	req =>
            	req.url === `${baseUrl}/api/movies/search` &&
            	req.params.get('year') === '2005' &&
   	         req.params.get('page') === '1' &&
            	req.params.get('pageSize') === '20'
    	);
 
    	expect(req.request.method).toBe('GET');
    	req.flush({
        	page: 1,
        	pageSize: 20,
        	totalResults: 0,
        	totalPages: 0,
        	hasPrev: false,
        	hasNext: false,
        	movies: []
    	});
	});
 
	it('should not include year param when year is undefined', () => {
    	service.searchMovies('alpha', undefined, 'david', 'tom', 1, 20).subscribe();
 
    	const req = httpMock.expectOne(
        	req =>
            	req.url === `${baseUrl}/api/movies/search` &&
            	req.params.get('title') === 'alpha' &&
            	req.params.get('director') === 'david' &&
            	req.params.get('starName') === 'tom' &&
            	req.params.get('page') === '1' &&
            	req.params.get('pageSize') === '20' &&
            	!req.params.has('year')
    	);
 
    	expect(req.request.method).toBe('GET');
    	req.flush({
        	page: 1,
        	pageSize: 20,
        	totalResults: 0,
        	totalPages: 0,
        	hasPrev: false,
        	hasNext: false,
        	movies: []
    	});
    });
 
	it('should send custom pagination params in search request', () => {
    	service.searchMovies('alpha', 2005, 'david', 'tom', 3, 5).subscribe();
 
    	const req = httpMock.expectOne(
        	req =>
            	req.url === `${baseUrl}/api/movies/search` &&
            	req.params.get('title') === 'alpha' &&
            	req.params.get('year') === '2005' &&
            	req.params.get('director') === 'david' &&
            	req.params.get('starName') === 'tom' &&
                req.params.get('page') === '3' &&
            	req.params.get('pageSize') === '5'
    	);
 
    	expect(req.request.method).toBe('GET');
    	req.flush({
        	page: 3,
        	pageSize: 5,
        	totalResults: 12,
        	totalPages: 3,
        	hasPrev: true,
        	hasNext: false,
        	movies: []
    	});
	});
 it('should handle empty search results', () => {
    	const mockResponse = {
        	page: 1,
      	  pageSize: 20,
        	totalResults: 0,
        	totalPages: 0,
        	hasPrev: false,
        	hasNext: false,
        	movies: []
    	};
 
    	service.searchMovies('no-such-movie', 2005, 'unknown', 'nobody', 1, 20)
       	 .subscribe(response => {
            	expect(response.page).toBe(1);
            	expect(response.pageSize).toBe(20);
            	expect(response.totalResults).toBe(0);
            	expect(response.totalPages).toBe(0);
            	expect(response.hasPrev).toBe(false);
            	expect(response.hasNext).toBe(false);
            	expect(response.movies).toEqual([]);
            	expect(Array.isArray(response.movies)).toBe(true);
        	});
 
    	const req = httpMock.expectOne(
        	req =>
            	req.url === `${baseUrl}/api/movies/search` &&
            	req.params.get('title') === 'no-such-movie' &&
            	req.params.get('year') === '2005' &&
            	req.params.get('director') === 'unknown' &&
            	req.params.get('starName') === 'nobody' &&
            	req.params.get('page') === '1' &&
            	req.params.get('pageSize') === '20'
    	);
 
    	expect(req.request.method).toBe('GET');
	    req.flush(mockResponse);
	});
	// ─── browseMoviesByGenre ──────────────────────────────────────────────────
 
	it('should browse movies by genre with default pagination', () => {
    	const mockResponse = {
        	page: 1,
        	pageSize: 20,
        	totalResults: 1,
        	totalPages: 1,
        	hasPrev: false,
        	hasNext: false,
        	movies: [
            	{
                	id: 'tt0443706',
                	title: 'Zodiac',
          	      year: 2007,
                	director: 'David Fincher',
                	rating: 4.6,
                	genres: [{ id: 1, name: 'Crime' }],
                	stars: [{ id: '2', name: 'Jake Gyllenhaal', birthYear: 1980 }]
            	}
        	]
    	};
 
    	service.browseMoviesByGenre(1).subscribe(response => {
 
        	//  2. RESPONSE KEYS
        	expect(response.page).toBeDefined();
        	expect(response.pageSize).toBeDefined();
        	expect(response.totalResults).toBeDefined();
        	expect(response.movies).toBeDefined();
 
        	//  3. MOVIE OBJECT KEYS
        	const movie = response.movies[0];
        	expect(movie.id).toBeDefined();
        	expect(movie.title).toBeDefined();
        	expect(movie.year).toBeDefined();
        	expect(movie.director).toBeDefined();
        	expect(movie.rating).toBeDefined();
        	expect(movie.genres).toBeDefined();
        	expect(movie.stars).toBeDefined();
        	expect(movie.genres[0].id).toBeDefined();
        	expect(movie.genres[0].name).toBeDefined();
 
        	//  4. VALUES
        	expect(movie.title).toBe('Zodiac');
        	expect(movie.genres[0].name).toBe('Crime');
        	expect(response.page).toBe(1);
 
        	//  5. TYPES
        	expect(typeof response.page).toBe('number');
        	expect(typeof response.pageSize).toBe('number');
        	expect(typeof response.totalResults).toBe('number');
        	expect(Array.isArray(response.movies)).toBe(true);
 
        	expect(typeof movie.id).toBe('string');
        	expect(typeof movie.title).toBe('string');
        	expect(typeof movie.year).toBe('number');
        	expect(typeof movie.director).toBe('string');
        	expect(typeof movie.rating).toBe('number');
        	expect(Array.isArray(movie.genres)).toBe(true);
        	expect(Array.isArray(movie.stars)).toBe(true);
        	expect(typeof movie.genres[0].id).toBe('number');
        	expect(typeof movie.genres[0].name).toBe('string');
    	});
 
    	//  1. CONNECTION
    	const req = httpMock.expectOne(
        	req => req.url === `${baseUrl}/api/movies/browseByGenre`
            	&& req.params.get('genreId') === '1'
            	&& req.params.get('page') === '1'
            	&& req.params.get('pageSize') === '20'
    	);
    	expect(req.request.method).toBe('GET');
    	req.flush(mockResponse);
	});
 
	it('should browse movies by genre with custom pagination', () => {
    	const mockResponse = {
        	page: 3,
        	pageSize: 5,
        	totalResults: 15,
        	totalPages: 3,
        	hasPrev: true,
        	hasNext: false,
        	movies: []
    	};
 
    	service.browseMoviesByGenre(2, 3, 5).subscribe(response => {
 
        	//  2. RESPONSE KEYS
        	expect(response.page).toBeDefined();
        	expect(response.pageSize).toBeDefined();
        	expect(response.totalResults).toBeDefined();
        	expect(response.totalPages).toBeDefined();
        	expect(response.hasPrev).toBeDefined();
        	expect(response.hasNext).toBeDefined();
        	expect(response.movies).toBeDefined();
 
        	//  4. VALUES
        	expect(response.page).toBe(3);
        	expect(response.hasPrev).toBe(true);
        	expect(response.hasNext).toBe(false);
        	expect(response.totalResults).toBe(15);
 
        	//  5. TYPES
        	expect(typeof response.page).toBe('number');
        	expect(typeof response.pageSize).toBe('number');
        	expect(typeof response.totalResults).toBe('number');
        	expect(typeof response.totalPages).toBe('number');
        	expect(typeof response.hasPrev).toBe('boolean');
        	expect(typeof response.hasNext).toBe('boolean');
        	expect(Array.isArray(response.movies)).toBe(true);
    	});
 
    	//  1. CONNECTION
    	const req = httpMock.expectOne(
        	req => req.url === `${baseUrl}/api/movies/browseByGenre`
            	&& req.params.get('genreId') === '2'
            	&& req.params.get('page') === '3'
            	&& req.params.get('pageSize') === '5'
    	);
   	 expect(req.request.method).toBe('GET');
    	req.flush(mockResponse);
	});
 
	// ─── browseMoviesByFirstLetter ────────────────────────────────────────────
 
	it('should browse movies by first letter with default pagination', () => {
    	const mockResponse = {
        	page: 1,
        	pageSize: 20,
        	totalResults: 2,
        	totalPages: 1,
        	hasPrev: false,
        	hasNext: false,
        	movies: [
            	{
                	id: 'tt0405296',
                	title: 'A Scanner Darkly',
                	year: 2006,
                	director: 'Richard Linklater',
                	rating: 4.0,
                	genres: [{ id: 2, name: 'Sci-Fi' }],
                	stars: [{ id: '3', name: 'Keanu Reeves', birthYear: 1964 }]
            	},
            	{
                	id: 'tt0344510',
                	title: 'A Very Long Engagement',
                	year: 2004,
                	director: 'Jean-Pierre Jeunet',
                	rating: 4.4,
                	genres: [{ id: 3, name: 'Romance' }],
                	stars: [{ id: '4', name: 'Audrey Tautou', birthYear: 1976 }]
            	}
        	]
    	};
 
    	service.browseMoviesByFirstLetter('A').subscribe(response => {
 
        	//  2. RESPONSE KEYS
        	expect(response.page).toBeDefined();
        	expect(response.pageSize).toBeDefined();
        	expect(response.totalResults).toBeDefined();
   	     expect(response.movies).toBeDefined();
 
        	//  3. MOVIE OBJECT KEYS
        	response.movies.forEach(movie => {
            	expect(movie.id).toBeDefined();
            	expect(movie.title).toBeDefined();
            	expect(movie.year).toBeDefined();
            	expect(movie.director).toBeDefined();
            	expect(movie.rating).toBeDefined();
            	expect(movie.genres).toBeDefined();
            	expect(movie.stars).toBeDefined();
        	});
 
 	       //  4. VALUES
        	expect(response.movies[0].title).toBe('A Scanner Darkly');
        	expect(response.movies.every(m => m.title.startsWith('A'))).toBe(true);
        	expect(response.totalResults).toBe(2);
 
        	//  5. TYPES
        	expect(typeof response.page).toBe('number');
        	expect(typeof response.pageSize).toBe('number');
        	expect(typeof response.totalResults).toBe('number');
        	expect(Array.isArray(response.movies)).toBe(true);
 
        	response.movies.forEach(movie => {
            	expect(typeof movie.id).toBe('string');
            	expect(typeof movie.title).toBe('string');
            	expect(typeof movie.year).toBe('number');
            	expect(typeof movie.director).toBe('string');
            	expect(typeof movie.rating).toBe('number');
            	expect(Array.isArray(movie.genres)).toBe(true);
            	expect(Array.isArray(movie.stars)).toBe(true);
            	expect(typeof movie.genres[0].id).toBe('number');
            	expect(typeof movie.genres[0].name).toBe('string');
            	expect(typeof movie.stars[0].id).toBe('string');
            	expect(typeof movie.stars[0].name).toBe('string');
        	    expect(typeof movie.stars[0].birthYear).toBe('number');
        	});
    	});
 
    	//  1. CONNECTION
    	const req = httpMock.expectOne(
        	req => req.url === `${baseUrl}/api/movies/browseByFirstLetter`
            	&& req.params.get('startsWith') === 'A'
            	&& req.params.get('page') === '1'
            	&& req.params.get('pageSize') === '20'
    	);
    	expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
	});
 
	it('should browse movies by first letter with custom pagination', () => {
    	const mockResponse = {
        	page: 2,
        	pageSize: 5,
        	totalResults: 10,
        	totalPages: 2,
        	hasPrev: true,
        	hasNext: false,
        	movies: []
    	};
 
    	service.browseMoviesByFirstLetter('B', 2, 5).subscribe(response => {
 
        	//  2. RESPONSE KEYS
        	expect(response.page).toBeDefined();
        	expect(response.pageSize).toBeDefined();
        	expect(response.hasPrev).toBeDefined();
        	expect(response.hasNext).toBeDefined();
 
        	//  4. VALUES
        	expect(response.page).toBe(2);
        	expect(response.pageSize).toBe(5);
        	expect(response.hasPrev).toBe(true);
        	expect(response.hasNext).toBe(false);
 
        	//  5. TYPES
        	expect(typeof response.page).toBe('number');
        	expect(typeof response.pageSize).toBe('number');
        	expect(typeof response.hasPrev).toBe('boolean');
        	expect(typeof response.hasNext).toBe('boolean');
        	expect(Array.isArray(response.movies)).toBe(true);
    	});
 
    	//  1. CONNECTION
    	const req = httpMock.expectOne(
        	req => req.url === `${baseUrl}/api/movies/browseByFirstLetter`
            	&& req.params.get('startsWith') === 'B'
            	&& req.params.get('page') === '2'
            	&& req.params.get('pageSize') === '5'
    	);
    	expect(req.request.method).toBe('GET');
    	req.flush(mockResponse);
	});
 
	// ─── getMovieById ─────────────────────────────────────────────────────────
 
	it('should get movie by ID', () => {
    	const mockMovie = {
        	id: 'tt999',
        	title: 'Study',
        	year: 2004,
        	director: 'Layan',
        	rating: 4.5,
        	genres: [
            	{ id: 1, name: 'Action' },
            	{ id: 2, name: 'Drama' }
        	],
        	stars: [
            	{ id: '1', name: 'Tom Hanks', birthYear: 1956 },
            	{ id: '2', name: 'Lena Headey', birthYear: 1973 }
        	]
    	};
 
    	service.getMovieById('tt999').subscribe(movie => {
 
        	//  2. RESPONSE KEYS
        	expect(movie.id).toBeDefined();
        	expect(movie.title).toBeDefined();
        	expect(movie.year).toBeDefined();
        	expect(movie.director).toBeDefined();
        	expect(movie.rating).toBeDefined();
        	expect(movie.genres).toBeDefined();
        	expect(movie.stars).toBeDefined();
 
        	//  3. NESTED OBJECT KEYS
        	expect(movie.genres[0].id).toBeDefined();
        	expect(movie.genres[0].name).toBeDefined();
        	expect(movie.stars[0].id).toBeDefined();
        	expect(movie.stars[0].name).toBeDefined();
        	expect(movie.stars[0].birthYear).toBeDefined();
 
        	//  4. VALUES
        	expect(movie.id).toBe('tt999');
        	expect(movie.title).toBe('Study');
        	expect(movie.director).toBe('Layan');
        	expect(movie.rating).toBe(4.5);
        	expect(movie.genres.length).toBe(2);
       	 expect(movie.stars.length).toBe(2);
        	expect(movie.stars[0].name).toBe('Tom Hanks');
 
        	//  5. TYPES
        	expect(typeof movie.id).toBe('string');
        	expect(typeof movie.title).toBe('string');
        	expect(typeof movie.year).toBe('number');
        	expect(typeof movie.director).toBe('string');
        	expect(typeof movie.rating).toBe('number');
        	expect(Array.isArray(movie.genres)).toBe(true);
        	expect(Array.isArray(movie.stars)).toBe(true);
 
        	expect(typeof movie.genres[0].id).toBe('number');
        	expect(typeof movie.genres[0].name).toBe('string');
        	expect(typeof movie.stars[0].id).toBe('string');
        	expect(typeof movie.stars[0].name).toBe('string');
        	expect(typeof movie.stars[0].birthYear).toBe('number');
    	});
 
    	//  1. CONNECTION
    	const req = httpMock.expectOne(`${baseUrl}/api/movies/tt999`);
    	expect(req.request.method).toBe('GET');
  	  req.flush(mockMovie);
	});
 
	it('should handle 404 error when movie ID is not found', () => {
    	service.getMovieById('tt000').subscribe({
        	next: () => { throw new Error('Expected an error, but got a response'); },
        	error: (error) => {
 
            	//  2. ERROR RESPONSE KEYS
            	expect(error.status).toBeDefined();
            	expect(error.statusText).toBeDefined();
 
            	//  4. ERROR VALUES
            	expect(error.status).toBe(404);
            	expect(error.statusText).toBe('Not Found');
 
            	//  5. TYPES
            	expect(typeof error.status).toBe('number');
            	expect(typeof error.statusText).toBe('string');
        	}
    	});
 
    	//  1. CONNECTION
    	const req = httpMock.expectOne(`${baseUrl}/api/movies/tt000`);
    	expect(req.request.method).toBe('GET');
    	req.flush('Movie not found', { status: 404, statusText: 'Not Found' });
	});
	it('should get title suggestions for autocomplete', () => {
  const mockSuggestions = [
	{ id: 'tt1375666', title: 'Inception' },
	{ id: 'tt0816692', title: 'Interstellar' }
  ];
 
  service.getTitleSuggestions('inc').subscribe(response => {
	expect(Array.isArray(response)).toBe(true);
	expect(response.length).toBe(2);
	expect(response[0].id).toBe('tt1375666');
	expect(response[0].title).toBe('Inception');
	expect(typeof response[0].id).toBe('string');
	expect(typeof response[0].title).toBe('string');
  });
 
  const req = httpMock.expectOne(
	req =>
  	req.url === `${baseUrl}/api/movies/autocomplete` &&
  	req.params.get('query') === 'inc'
  );
 
  expect(req.request.method).toBe('GET');
  req.flush(mockSuggestions);
});
 
it('should return empty suggestions array when autocomplete has no matches', () => {
  service.getTitleSuggestions('zzz').subscribe(response => {
	expect(Array.isArray(response)).toBe(true);
	expect(response).toEqual([]);
  });
 
  const req = httpMock.expectOne(
	req =>
  	req.url === `${baseUrl}/api/movies/autocomplete` &&
  	req.params.get('query') === 'zzz'
  );
 
  expect(req.request.method).toBe('GET');
  req.flush([]);
});
 
it('should pass trimmed-looking query value exactly as provided to autocomplete endpoint', () => {
  service.getTitleSuggestions('ince').subscribe();
 
  const req = httpMock.expectOne(
	req =>
  	req.url === `${baseUrl}/api/movies/autocomplete` &&
  	req.params.get('query') === 'ince'
  );
 
  expect(req.request.method).toBe('GET');
  req.flush([]);
});
 
});
