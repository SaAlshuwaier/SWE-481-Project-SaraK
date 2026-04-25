// This service is responsible for fetching genre data from the backend API. It uses Angular's HttpClient to make HTTP requests and returns the data as Observables that components can subscribe to.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GenreDto } from '../models/GenreDto';
import { environment } from '../../../environment/environment';
import { tap } from 'rxjs/operators';


// The @Injectable decorator marks this class as a service that can be injected into components. The providedIn: 'root' means that this service will be a singleton and available throughout the application without needing to add it to the providers array in any module.
@Injectable({
  providedIn: 'root'
})
export class GenreService {
  // The apiUrl is the base URL for the backend API endpoint that provides genre data. In this case, it points to a local server running on port 8080.
  private apiUrl = environment.backendUrl + '/api/genres';
  private cachedGenres: GenreDto[] | null = null; // cache stored here


  // The constructor injects the HttpClient service, which is used to make HTTP requests to the backend API.
  constructor(private http: HttpClient) {}

  getAllGenres(): Observable<GenreDto[]> {
    if (this.cachedGenres) {
      return of(this.cachedGenres); // return cached, no HTTP call
    }
    // This method makes a GET request to the backend API to fetch all genres. It returns an Observable that emits an array of GenreDto objects when the data is received.
    return this.http.get<GenreDto[]>(this.apiUrl).pipe(
      tap(genres => this.cachedGenres = genres) // store on first fetch
    );
  }
}