import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
 
import { MovieDto } from '../models/MovieDto';
import { MoviesPageStateDto } from '../models/MoviesPageStateDto';
 
@Injectable({
	providedIn: 'root'
})
export class MovieService {
 
	constructor(private http: HttpClient) { }
 
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
 
    	return this.http.get<MoviesPageStateDto>(
        	`${environment.backendUrl}/api/movies/search`,
        	{ params }
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
 
    	return this.http.get<MoviesPageStateDto>(
        	`${environment.backendUrl}/api/movies/browseByGenre`,
        	{
            	params: {
                	genreId,
                	page,
                	pageSize
            	}
        	}
    	);
	}
 
	browseMoviesByFirstLetter(
    	startsWith: string,
    	page: number = 1,
    	pageSize: number = 20
	): Observable<MoviesPageStateDto> {
 
    	return this.http.get<MoviesPageStateDto>(
        	`${environment.backendUrl}/api/movies/browseByFirstLetter`,
        	{
            	params: {
                	startsWith,
                	page,
                	pageSize
            	}
        	}
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
