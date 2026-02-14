import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {StarDto} from '../models/StarDto';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {MovieDto} from '../models/MovieDto';

@Injectable({
    providedIn:'root',
  })

export class StarService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.backendUrl;

  getStar(starId: string) : Observable<StarDto> {
    return this.http.get<StarDto>(`${this.baseUrl}/api/stars/${starId}`);
  }

  getStarsOfMovie(movieId: string) : Observable<StarDto[]> {
    return this.http.get<StarDto[]> (`${this.baseUrl}/api/movies/${movieId}/stars`);
  }

  getMoviesOfStar(starId: string) : Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${this.baseUrl}/api/stars/${starId}/movies`);
  }

}
