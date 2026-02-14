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

    /**
     * SEARCH movies
     * Search by:
     * - title
     * - year
     * - director
     * - star name
     *
     * Multiple parameters can be used together (AND logic in backend)
     */
    searchMovies(
        title?: string,
        year?: number,
        director?: string,
        starName?: string,
        page: number = 1,
        pageSize: number = 10
    ): Observable<MoviesPageStateDto> {

        let params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize);

        if (title) params = params.set('title', title);
        if (year) params = params.set('year', year);
        if (director) params = params.set('director', director);
        if (starName) params = params.set('starName', starName);

        return this.http.get<MoviesPageStateDto>(
            `${environment.backendUrl}/api/v1/movies`,
            { params }
        );
    }

    /**
     * BROWSE movies by GENRE
     */
    browseMoviesByGenre(
        genreId: number,
        page: number = 1,
        pageSize: number = 10
    ): Observable<MoviesPageStateDto> {

        return this.http.get<MoviesPageStateDto>(
            `${environment.backendUrl}/api/v1/movies/browseByGenre`,
            {
                params: {
                    genreId,
                    page,
                    pageSize
                }
            }
        );
    }

    /**
     * BROWSE movies by FIRST LETTER or DIGIT
     * Example: A, B, C, 2
     */
    browseMoviesByFirstLetter(
        startsWith: string,
        page: number = 1,
        pageSize: number = 10
    ): Observable<MoviesPageStateDto> {

        return this.http.get<MoviesPageStateDto>(
            `${environment.backendUrl}/api/v1/movies/browseByFirstLetter`,
            {
                params: {
                    startsWith,
                    page,
                    pageSize
                }
            }
        );
    }

    /**
     * GET single movie by ID
     */
    getMovieById(movieId: string): Observable<MovieDto> {
        return this.http.get<MovieDto>(
            `${environment.backendUrl}/api/v1/movies/${movieId}`
        );
    }
}
