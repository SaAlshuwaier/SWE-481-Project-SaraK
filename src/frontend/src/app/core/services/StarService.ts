import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {StarDto} from '../models/StarDto';
import {Observable, of, tap} from 'rxjs';
import {Injectable} from '@angular/core';
import {MovieDto} from '../models/MovieDto';

@Injectable({
    providedIn:'root',
  })

export class StarService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.backendUrl;
  private starCache = new Map<string, StarDto>();
  private starMoviesCache = new Map<string, MovieDto[]>();  

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
    if (this.starCache.has(starId)) {
      console.log('[CACHE HIT] getStar - key:', starId);
      return of(this.starCache.get(starId)!);
    }
    console.log('[CACHE MISS] getStar - hitting backend, key:', starId);
    return this.http.get<StarDto>(`${this.baseUrl}/api/stars/${starId}`).pipe(
      tap(res => this.starCache.set(starId, res))
    );
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
  getMoviesOfStar(starId: string): Observable<MovieDto[]> {
  if (this.starMoviesCache.has(starId)) {
    console.log('[CACHE HIT] getMoviesOfStar - starId:', starId);
    return of(this.starMoviesCache.get(starId)!);
  }
  console.log('[CACHE MISS] getMoviesOfStar - hitting backend, starId:', starId);
  return this.http.get<MovieDto[]>(`${this.baseUrl}/api/stars/${starId}/movies`).pipe(
    tap(res => this.starMoviesCache.set(starId, res))
  );
}
}
