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
     * Search movies.
 *
 * Logic:
 * - Sends optional filters (title, year, director, starName)
 * - Applies pagination (page, pageSize)
 * - Receives paged movie list with metadata
 *
 * @request GET /api/movies/search
 * @return {
 *   "page": 1,
 *   "pageSize": 20,
 *   "totalResults": 1,
 *   "totalPages": 1,
 *   "hasPrev": false,
 *   "hasNext": false,
 *   "movies": [
 *     {
 *       "id": "tt123",
 *       "title": "Inception",
 *       "year": 2010,
 *       "director": "Christopher Nolan",
 *       "rating": 4.7,
 *       "genres": [
 *         { "id": 1, "name": "Action" }
 *       ],
 *       "stars": [
 *         { "id": "1", "name": "Leonardo DiCaprio", "birthYear": 1974 }
 *       ]
 *     }
 *   ]
 * }
 */
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

    /**
     * Browse movies by genre.
     *
     * Logic:
     * - Sends genreId
     * - Applies pagination (page, pageSize)
     * - Receives paged movie list with metadata
     *
     * @request GET /api/movies/browseByGenre
     * @return {
     *   "page": 1,
     *   "pageSize": 20,
     *   "totalResults": 1,
     *   "totalPages": 1,
     *   "hasPrev": false,
     *   "hasNext": false,
     *   "movies": [
     *     {
     *       "id": "tt555",
     *       "title": "The Dark Knight",
     *       "year": 2008,
     *       "director": "Christopher Nolan",
     *       "rating": 4.9,
     *       "genres": [
     *         { "id": 1, "name": "Action" }
     *       ],
     *       "stars": [
     *         { "id": "2", "name": "Christian Bale", "birthYear": 1974 }
     *       ]
     *     }
     *   ]
     * }
     */
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

    /**
    * Browse movies by first letter.
     *
     * Logic:
     * - Sends startsWith character
     * - Applies pagination (page, pageSize)
     * - Receives paged movie list with metadata
     *
     * @request GET /api/movies/browseByFirstLetter
     * @return {
     *   "page": 1,
     *   "pageSize": 20,
     *   "totalResults": 1,
     *   "totalPages": 1,
     *   "hasPrev": false,
     *   "hasNext": false,
     *   "movies": [
     *     {
     *       "id": "tt777",
     *       "title": "Avatar",
     *       "year": 2009,
     *       "director": "James Cameron",
     *       "rating": 4.2,
     *       "genres": [
     *         { "id": 2, "name": "Sci-Fi" }
     *       ],
     *       "stars": [
     *         { "id": "3", "name": "Sam Worthington", "birthYear": 1976 }
     *       ]
     *     }
     *   ]
     * }
     */
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

    /**
     * Get movie by ID.
     *
     * Logic:
     * - Sends movie ID
     * - Receives full movie details including genres and stars
     *
     * @request GET /api/movies/{id}
     * @return {
     *   "id": "tt999",
     *   "title": "Study",
     *   "year": 2004,
     *   "director": "Layan",
     *   "rating": 4.5,
     *   "genres": [
     *     { "id": 1, "name": "Action" },
     *     { "id": 2, "name": "Drama" }
     *   ],
     *   "stars": [
     *     { "id": "1", "name": "Tom Hanks", "birthYear": 1956 },
     *     { "id": "2", "name": "Lena Headey", "birthYear": 1973 }
     *   ]
     * }
     */
    getMovieById(movieId: string): Observable<MovieDto> {
        return this.http.get<MovieDto>(
            `${environment.backendUrl}/api/movies/${movieId}`
        );
    }
}
