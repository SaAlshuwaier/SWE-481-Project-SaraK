import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StarDetailsPageComponent } from './starDetailsPage';
import { StarService } from '../../core/services/StarService';

import { StarDto } from '../../core/models/StarDto';
import { MovieDto } from '../../core/models/MovieDto';

describe('StarDetailsPageComponent', () => {

  let component: StarDetailsPageComponent;
  let fixture: ComponentFixture<StarDetailsPageComponent>;

  let starService: jasmine.SpyObj<StarService>;

  // mocks created in beforeEach
  let mockStar: StarDto;
  let mockMovies: MovieDto[];

  beforeEach(async () => {

    // create mock service
    starService = jasmine.createSpyObj('StarService', [
      'getStar',
      'getMoviesOfStar',
    ]);

    // create mock data
    mockStar = {
      id: 'nm1636964',
      name: 'Phantom Artsy',
      birthYear: 1970,
    };

    mockMovies = [
      {
        id: 'tt0413051',
        title: 'No Longer My Twin',
        year: 2002,
        director: 'Robert G. Christie',
        rating: 1.4,
        genres: [{ id: 16, name: 'Mystery' }],
        stars: [
          { id: 'nm1636964', name: 'Phantom Artsy', birthYear: 1970 },
          { id: 'nm1382753', name: 'Maria Angelucci', birthYear: 1975 },
          { id: 'nm1637113', name: 'R.G. Christie', birthYear: 1965 },
          { id: 'nm1349998', name: 'Robert G. Christie', birthYear: 1960 },
          { id: 'nm1696209', name: 'Fran Lane', birthYear: 1982 },
          { id: 'nm0627614', name: 'Adrienne Newberg', birthYear: 1984 },
          { id: 'nm1635658', name: 'Mark Kelly', birthYear: 1978 },
          { id: 'nm1637717', name: 'Sean Washburn', birthYear: 1981 },
        ],
      },
    ];

    await TestBed.configureTestingModule({
      imports: [
        StarDetailsPageComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: StarService, useValue: starService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ starId: 'nm1636964' })),
          },
        },
      ],
    }).compileComponents();

    // create component instance 
    fixture = TestBed.createComponent(StarDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load star and its movies on init (check each key)', () => {
    // Arrange
    starService.getStar.and.returnValue(of(mockStar));
    starService.getMoviesOfStar.and.returnValue(of(mockMovies));

    // Act
    fixture.detectChanges(); // triggers ngOnInit

    // Assert - calls
    expect(starService.getStar).toHaveBeenCalledWith('nm1636964');
    expect(starService.getMoviesOfStar).toHaveBeenCalledWith('nm1636964');

    // Assert - each star key
    const s = component.star();
    expect(s).toBeTruthy();

    expect(s!.id).toBe(mockStar.id);
    expect(s!.name).toBe(mockStar.name);
    expect(s!.birthYear).toBe(mockStar.birthYear);

    // Assert - movies keys
    const movies = component.movies();
    expect(movies.length).toBe(mockMovies.length);

    const m0 = movies[0];
    const expected0 = mockMovies[0];

    expect(m0.id).toBe(expected0.id);
    expect(m0.title).toBe(expected0.title);
    expect(m0.year).toBe(expected0.year);
    expect(m0.director).toBe(expected0.director);
    expect(m0.rating).toBe(expected0.rating);

    // genres
    expect(m0.genres.length).toBe(expected0.genres.length);
    expect(m0.genres[0].id).toBe(expected0.genres[0].id);
    expect(m0.genres[0].name).toBe(expected0.genres[0].name);

    // stars in the movie
    expect(m0.stars.length).toBe(expected0.stars.length);
    for (let i = 0; i < expected0.stars.length; i++) {
      expect(m0.stars[i].id).toBe(expected0.stars[i].id);
      expect(m0.stars[i].name).toBe(expected0.stars[i].name);
      expect(m0.stars[i].birthYear).toBe(expected0.stars[i].birthYear);
    }
  });

  it('should render movies as hyperlinks (anchor + correct titles)', () => {
    // Arrange
    starService.getStar.and.returnValue(of(mockStar));
    starService.getMoviesOfStar.and.returnValue(of(mockMovies));

    // Act
    fixture.detectChanges();

    // StarDetailsPage.html movies list class = movie-list
    const container = fixture.nativeElement.querySelector('.movie-list');
    expect(container).toBeTruthy();

    const movieLinks: NodeListOf<HTMLAnchorElement> = container.querySelectorAll('a');

    // 1) correct count
    expect(movieLinks.length).toBe(mockMovies.length);

    // 2) anchor
    expect(movieLinks[0].tagName).toBe('A');

    // 3) correct text based on mock titles
    const renderedTexts = Array.from(movieLinks).map(a => (a.textContent ?? '').trim());
    for (const m of mockMovies) {
      expect(renderedTexts.some(t => t.includes(String(m.title)))).toBeTrue();
    }
  });

});