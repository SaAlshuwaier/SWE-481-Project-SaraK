import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {GenreDto} from '../models/GenreDto';

@Injectable({
  providedIn:'root',
})

export class GenreService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.backendUrl;

  getAllGenres(): Observable<GenreDto[]> {
    return this.http.get<GenreDto[]>(`${this.baseUrl}/api/genres`);
  }
}
