import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {StarDto} from '../models/StarDto';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';

@Injectable({
    providedIn:'root',
  })

export class StarService {
  private http = Inject(HttpClient);
  private baseUrl = environment.backendUrl;

  getStar(starId: String) : Observable<StarDto> {
    return this.http.get(`${this.baseUrl}/stars/${starId}`);
  }

}
