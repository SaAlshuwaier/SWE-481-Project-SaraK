// This file contains unit tests for the MovieService, which is responsible for making HTTP requests to the backend API to fetch movie data. We use Angular's HttpClientTestingModule to mock HTTP requests and verify that the service is making the correct calls with the expected parameters.


import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { MoviesPageState } from '../models/movie.models';

describe('MovieService (HTTP Mocking)', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call GET /api/movies/search with query params', () => {
    // Arrange
    const mockResponse: MoviesPageState = {
      movies: [
        { id: '1', title: 'The Matrix', year: 1999, director: 'Wachowski', rating: 8.7 }
      ],
      page: 1,
      pageSize: 20,
      totalMovies: 1,
      totalPages: 1,
    };

    // Act
    service.searchMovies({ title: 'matrix', page: 1, pageSize: 20 }).subscribe(res => {
      // Assert response
      expect(res.movies.length).toBe(1);
      expect(res.movies[0].title).toBe('The Matrix');
    });

    // Assert request details (method + URL + params)
    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === 'http://localhost:8080/api/movies/search' &&
      r.params.get('title') === 'matrix' &&
      r.params.get('page') === '1' &&
      r.params.get('pageSize') === '20'
    );

    req.flush(mockResponse);
  });

  it('should call GET /api/movies/browseByFirstLetter with params', () => {
    // Arrange
    const mockResponse: MoviesPageState = {
      movies: [],
      page: 1,
      pageSize: 20,
      totalMovies: 0,
      totalPages: 0,
    };

    // Act
    service.browseByFirstLetter('T', 1, 20).subscribe(res => {
      expect(res.page).toBe(1);
    });

    // Assert
    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === 'http://localhost:8080/api/movies/browseByFirstLetter' &&
      r.params.get('startsWith') === 'T'
    );

    req.flush(mockResponse);
  });
});