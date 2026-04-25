import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
 
import { MovieDto } from '../models/MovieDto';
import { MoviesPageStateDto } from '../models/MoviesPageStateDto';
 
@Injectable({
	providedIn: 'root'
})
export class MovieService {
 
	constructor(private http: HttpClient) { }
	private searchCache = new Map<string, MoviesPageStateDto>();
private genreBrowseCache = new Map<string, MoviesPageStateDto>();
private letterBrowseCache = new Map<string, MoviesPageStateDto>();
 
	searchMovies(
    	title?: string,
    	year?: number,
    	director?: string,
	    starName?: string,
    	page: number = 1,
    	pageSize: number = 20
	): Observable<MoviesPageStateDto> {
 
    	let params = new HttpParams()
        	.set('page', page)
        	.set('pageSize', pageSize);
 
    	if (title) params = params.set('title', title);
 
    	if (year !== undefined && year !== null) {
        	params = params.set('year', year);
    	}
 
    	if (director) params = params.set('director', director);
    	if (starName) params = params.set('starName', starName);
 
    	const key = JSON.stringify({
  title,
  year,
  director,
  starName,
  page,
  pageSize
});

//if exists in cache → return cached value
if (this.searchCache.has(key)) {
  return of(this.searchCache.get(key)!);
}

//if not in cache → make HTTP request and cache the result
return this.http.get<MoviesPageStateDto>(
  `${environment.backendUrl}/api/movies/search`,
  { params }
).pipe(
  tap((res) => {
    this.searchCache.set(key, res);
  })
);
	}
 
 getTitleSuggestions(query: string): Observable<MovieSuggestionDto[]> {
	const params = new HttpParams().set('query', query);
 
	return this.http.get<MovieSuggestionDto[]>(
    	`${environment.backendUrl}/api/movies/autocomplete`,
    	{ params }
	);
}
 
	browseMoviesByGenre(
  genreId: number,
  page: number = 1,
  pageSize: number = 20
): Observable<MoviesPageStateDto> {
  const key = JSON.stringify({ genreId, page, pageSize });

  if (this.genreBrowseCache.has(key)) {
    return of(this.genreBrowseCache.get(key)!);
  }

  return this.http.get<MoviesPageStateDto>(
    `${environment.backendUrl}/api/movies/browseByGenre`,
    {
      params: {
        genreId,
        page,
        pageSize
      }
    }
  ).pipe(
    tap((res) => {
      this.genreBrowseCache.set(key, res);
    })
  );
}
browseMoviesByFirstLetter(
  startsWith: string,
  page: number = 1,
  pageSize: number = 20
): Observable<MoviesPageStateDto> {
  const key = JSON.stringify({ startsWith, page, pageSize });

  if (this.letterBrowseCache.has(key)) {
    return of(this.letterBrowseCache.get(key)!);
  }

  return this.http.get<MoviesPageStateDto>(
    `${environment.backendUrl}/api/movies/browseByFirstLetter`,
    {
      params: {
        startsWith,
        page,
        pageSize
      }
    }
  ).pipe(
    tap((res) => {
      this.letterBrowseCache.set(key, res);
    })
  );
}
 
	getMovieById(movieId: string): Observable<MovieDto> {
    	return this.http.get<MovieDto>(
        	`${environment.backendUrl}/api/movies/${movieId}`
    	);
	}
}
export interface MovieSuggestionDto {
  id: string;
  title: string;
}
