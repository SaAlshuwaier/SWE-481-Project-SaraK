import { Routes } from '@angular/router';
import { MovieDetailsPageComponent } from './pages/MovieDetailsPage/movieDetailsPage';
import { StarDetailsPageComponent } from './pages/StarDetailsPage/starDetailsPage';
import { BrowseMoviesComponent } from './pages/browseMovies/browseMovies.component';

export const routes: Routes = [
    {path: 'movies/:movieId', component: MovieDetailsPageComponent},
      {path: 'movies/:movieId/stars/:starId', component: StarDetailsPageComponent},

  {  path: '',
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

