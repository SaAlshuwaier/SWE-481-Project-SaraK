import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { BrowseMoviesComponent } from './pages/browseMovies/browseMovies.component';
import { SearchMoviesComponent } from './pages/searchMovies/searchMovies.component';
import { MovieDetailsPageComponent } from './pages/MovieDetailsPage/movieDetailsPage';
import { StarDetailsPageComponent } from './pages/StarDetailsPage/starDetailsPage';

export const routes: Routes = [
  // default
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // home
  { path: 'home', component: HomeComponent },

  // details
  { path: 'movies/:movieId', component: MovieDetailsPageComponent },
  { path: 'movies/:movieId/stars/:starId', component: StarDetailsPageComponent },

  // browse pages
  { path: 'movies', component: BrowseMoviesComponent },
  { path: 'movies/genre/:genreId', component: BrowseMoviesComponent },
  { path: 'movies/star/:starId', component: BrowseMoviesComponent },

  // search page (separate)
  { path: 'movies/search', component: SearchMoviesComponent },

  // fallback
  { path: '**', redirectTo: 'home' },
];