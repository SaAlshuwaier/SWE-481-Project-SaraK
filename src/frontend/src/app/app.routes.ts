import { Routes } from '@angular/router';
import { MovieDetailsPageComponent } from './pages/MovieDetailsPage/movieDetailsPage';
import { StarDetailsPageComponent } from './pages/StarDetailsPage/starDetailsPage';
import { BrowseMoviesComponent } from './pages/browseMovies/browseMovies.component';
import { LoginPageComponent } from './pages/LoginPage/loginPage';
import { CartPageComponent } from './pages/CartPage/cartPage';
import { RegisterPageComponent } from './pages/RegisterPage/registerPage';
export const routes: Routes = [
    {path: 'movies/:movieId', component: MovieDetailsPageComponent},
      {path: 'movies/:movieId/stars/:starId', component: StarDetailsPageComponent},
 { path: 'login', component: LoginPageComponent },
  { path: 'cart', component: CartPageComponent },
   { path: 'register', component: RegisterPageComponent },
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
    path: 'movies/star/:starId',
    component: BrowseMoviesComponent
  }
];

