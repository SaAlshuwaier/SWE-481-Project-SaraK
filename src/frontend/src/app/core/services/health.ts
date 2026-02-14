import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import {HealthResponse} from '../models/HealthDto';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  constructor(private http: HttpClient) {}

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${environment.backendUrl}api/health`);
  }
}
