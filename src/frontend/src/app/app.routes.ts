import { Routes } from '@angular/router';
import { BrowseMoviesComponent } from './pages/browseMovies/browseMovies.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full'
  },
  {
    path: 'movies',
    component: BrowseMoviesComponent
  },
  {
    path: 'movies/genre/:genreId',
    component: BrowseMoviesComponent
  },
  {
    path: 'movies/stars/:starId',
    component: BrowseMoviesComponent
  }
];

