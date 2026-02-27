// here we define the MovieService which will handle all API calls related to movies, including searching, browsing, and fetching movie details by ID. This service will be used by our components to interact with the backend API.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoviesPageState, Movie } from '../models/movie.models';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly baseUrl = 'http://localhost:8080/api/movies';

  constructor(private http: HttpClient) {}

  searchMovies(filters: {
    title?: string;
    year?: number;
    director?: string;
    starName?: string;
    page?: number;
    pageSize?: number;
  }): Observable<MoviesPageState> {
    let params = new HttpParams();

    if (filters.title) params = params.set('title', filters.title);
    if (filters.year !== undefined) params = params.set('year', String(filters.year));
    if (filters.director) params = params.set('director', filters.director);
    if (filters.starName) params = params.set('starName', filters.starName);

    params = params.set('page', String(filters.page ?? 1));
    params = params.set('pageSize', String(filters.pageSize ?? 20));

    return this.http.get<MoviesPageState>(`${this.baseUrl}/search`, { params });
  }

  browseByGenre(genreId: number, page = 1, pageSize = 20): Observable<MoviesPageState> {
    const params = new HttpParams()
      .set('genreId', String(genreId))
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<MoviesPageState>(`${this.baseUrl}/browseByGenre`, { params });
  }

  browseByFirstLetter(startsWith: string, page = 1, pageSize = 20): Observable<MoviesPageState> {
    const params = new HttpParams()
      .set('startsWith', startsWith)
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<MoviesPageState>(`${this.baseUrl}/browseByFirstLetter`, { params });
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}