import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import {HealthResponse} from '../models/HealthDto';

/**
 * HealthService is an Angular service that provides a method to check the health of the backend service by making an HTTP GET request to the /api/health endpoint.
 */
@Injectable({
  providedIn: 'root'
})
export class HealthService {

  constructor(private http: HttpClient) {}

  /**
   * Logic: This method makes an HTTP GET request to the /api/health endpoint of the backend service to retrieve the health status. It returns an Observable that emits a HealthResponse object containing the status and service name.
   * Params: None
   * Returns: An Observable<HealthResponse> that emits the health status of the backend service.
   */
  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${environment.backendUrl}api/health`);
  }
}
