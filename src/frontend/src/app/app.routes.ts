import { Routes } from '@angular/router';
import { BrowseMoviesComponent } from './pages/browseMovies/browseMovies.component';

export const routes: Routes = [
  //path routes to pages are defined
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full'
  },
  {
    path: 'movies',
    component: BrowseMoviesComponent
  }
];
