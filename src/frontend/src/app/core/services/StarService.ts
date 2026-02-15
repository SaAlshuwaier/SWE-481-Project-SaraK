import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {StarDto} from '../models/StarDto';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {MovieDto} from '../models/MovieDto';

@Injectable({
    providedIn:'root',
  })

export class StarService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.backendUrl;

  /**
   * Get a specific star details
   * Logic:
   * -Retrieves: all Information of a star
   * -Returns: a starDto object
   *
   * @param starId
   * @request GET /api/stars/{starId}
   * @return {
   *     "success": true,
   *     "data":{
   *          "id" : "nm1651765",
   *          "name" : "Gregory Bayne",
   *          "birthYear": 1973,
   *     }
   * }
   */
  getStar(starId: string) : Observable<StarDto> {
    return this.http.get<StarDto>(`${this.baseUrl}/api/stars/${starId}`);
  }


  /**
   * Get a list of starts for a movie
   * Logic:
   * -Retrieves: all starts of a movie
   * -Returns: list of StarDto
   *
   * @param movieId
   * @request GET /api/movies/{movieId}/stars
   * @return {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": "nm1698522",
   *       "name": "Chris Cashman",
   *       "birthYear": 1975
   *     },
   *     {
   *       "id": "nm1698387",
   *       "name": "Julio Cesar Estrada",
   *       "birthYear": 1973
   *     }
   *   ]
   * }
   */
  getStarsOfMovie(movieId: string) : Observable<StarDto[]> {
    return this.http.get<StarDto[]> (`${this.baseUrl}/api/movies/${movieId}/stars`);
  }


  /**
   * Get a list of movies for a star
   * Logic:
   * -Retrieves: all movies of a star
   * -Returns: list of MovieDto
   *
   * @param starId
   * @request GET /api/stars/{starId}/movies
   * @return {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": "tt0401792",
   *       "title": "Sin City",
   *       "year": 2005,
   *       "director": "Quentin Tarantino"
   *     },
   *     {
   *       "id": "tt0469641",
   *       "title": "World Trade Center",
   *       "year": 2006,
   *       "director": "Oliver Stone"
   *     }
   *   ]
   * }
   */
  getMoviesOfStar(starId: string) : Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${this.baseUrl}/api/stars/${starId}/movies`);
  }
}
