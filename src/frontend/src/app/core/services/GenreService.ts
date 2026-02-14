import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {GenreDto} from '../models/GenreDto';
import {MovieDto} from '../models/MovieDto';

@Injectable({
  providedIn:'root',
})

export class GenreService {
  private http = Inject(HttpClient);
  private baseUrl = environment.backendUrl;

  getAllGenres(): Observable<GenreDto[]> {
    return this.http.get(`${this.baseUrl}/api/genres`);
  }

  getMoviesByGenre(genreId: number): Observable<MovieDto[]> {
    return this.http.get(`${this.baseUrl}/api/genres/${genreId}/movies`);
  }

}
