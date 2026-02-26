import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { StarService } from './StarService';
import { environment } from '../../../environment/environment';
import { StarDto } from '../models/StarDto';
import { MovieDto } from '../models/MovieDto';

describe('StarService (HTTP Mock Tests)', () => {

  let service: StarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Enables HTTP mocking
      providers: [StarService],
    });

    service = TestBed.inject(StarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensures that no unexpected HTTP requests remain
    httpMock.verify();
  });

  // TEST 1: GET /api/stars/{starId}
  it('should fetch star details by id', () => {

    const mockStar: StarDto = {
      id: 'nm1313404',
      name: 'Christopher Penney',
      birthYear: 1982,
    };

    // Act
    service.getStar(mockStar.id).subscribe(response => {
      
      // Type validation
      expect(typeof response.id).toBe('string');
      expect(typeof response.name).toBe('string');
      expect(typeof response.birthYear).toBe('number');

      // Value validation
      expect(response.id).toBe('nm1313404');
      expect(response.name).toBe('Christopher Penney');
      expect(response.birthYear).toBe(1982);

    });

    // Assert request details
    const req = httpMock.expectOne(
      `${environment.backendUrl}/api/stars/${mockStar.id}`
    );

    expect(req.request.method).toBe('GET');

    // Provide fake backend response
    req.flush(mockStar);
  });


  // TEST 2: GET /api/stars/{starId}/movies

  it('should fetch movies of a star', () => {

    // Arrange
    const starId = 'nm1636964';

    const mockMovies: MovieDto[] = [
      {
        id: 'tt0413051',
        title: 'No Longer My Twin',
        year: 2002,
        director: 'Robert G. Christie',
        rating: 1.4,
        genres: [{ id: 16, name: 'Mystery' }],
        stars: [{
        id: 'nm1636964',
        name: 'Phantom Artsy',
      },
      {
        id: 'nm1382753',
        name: 'Maria Angelucci',
      },
      {
        id: 'nm1637113',
        name: 'R.G. Christie',
      },{
        id: 'nm1349998',
        name: 'Robert G. Christie',
      },
      {
        id: 'nm1696209',
        name: 'Fran Lane',
      },
      {
        id: 'nm0627614',
        name: 'Adrienne Newberg',
      },{
        id: 'nm1635658',
        name: 'Mark Kelly',
      },
      {
        id: 'nm1637717',
        name: 'Sean Washburn',
      },
     ],
      },
    ];

    // Act
    service.getMoviesOfStar(starId).subscribe(response => {

      // Assert response body
      expect(response.length).toBe(1);

      const movie = response[0];

      // Type validation
      expect(typeof movie.id).toBe('string');
      expect(typeof movie.title).toBe('string');
      expect(typeof movie.year).toBe('number');
      expect(typeof movie.director).toBe('string');
      expect(typeof movie.rating).toBe('number');

      expect(Array.isArray(movie.genres)).toBeTrue();
      expect(Array.isArray(movie.stars)).toBeTrue();

      // Validate nested genre
      const genre = movie.genres[0];
      expect(typeof genre.id).toBe('number');
      expect(typeof genre.name).toBe('string');

      // Validate nested star
      const star = movie.stars[0];
      expect(typeof star.id).toBe('string');
      expect(typeof star.name).toBe('string');

      // Assert response body 
      expect(movie.title).toBe('No Longer My Twin'); 
      expect(movie.director).toBe('Robert G. Christie');
    });

    // Assert request details
    const req = httpMock.expectOne(
      `${environment.backendUrl}/api/stars/${starId}/movies`
    );

    expect(req.request.method).toBe('GET');

    // Provide fake backend response
    req.flush(mockMovies);
  });

});