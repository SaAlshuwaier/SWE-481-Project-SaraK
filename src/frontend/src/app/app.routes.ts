import { Routes } from '@angular/router';
import { MovieDetailsPageComponent } from './MovieDetailsPage/movieDetailsPage';
import { App } from './app';
import { StarDetailsPageComponent } from './pages/StarDetailsPage/starDetailsPage';

export const routes: Routes = [
    {path: 'movies/:movieId', component: MovieDetailsPageComponent},
      {path: 'stars/:starId', component: StarDetailsPageComponent},
];