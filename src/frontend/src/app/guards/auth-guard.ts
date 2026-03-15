import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { environment } from '../../environment/environment';

export const authGuard: CanActivateFn = () => {

  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get(
    `${environment.backendUrl}/api/auth/session`,
    { withCredentials: true }
  ).pipe(

    map(() => true),

    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })

  );

};