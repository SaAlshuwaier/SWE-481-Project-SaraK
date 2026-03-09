import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { BrowseMoviesComponent } from './pages/browseMovies/browseMovies.component';
import { SearchMoviesComponent } from './pages/searchMovies/searchMovies.component';
import { MovieDetailsPageComponent } from './pages/MovieDetailsPage/movieDetailsPage';
import { StarDetailsPageComponent } from './pages/StarDetailsPage/starDetailsPage';
import { CartPageComponent } from './pages/CartPage/cartPage';
import { LoginPageComponent } from './pages/LoginPage/loginPage';
import { RegisterPageComponent } from './pages/RegisterPage/registerPage';
import { CheckoutPageComponent } from './pages/checkoutPage/checkoutPage';
export const routes: Routes = [

  // default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // home
  { path: 'home', component: HomeComponent },

  // authentication
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },

  // movies
  { path: 'movies', component: BrowseMoviesComponent },
  { path: 'movies/search', component: SearchMoviesComponent },
  { path: 'movies/genre/:genreId', component: BrowseMoviesComponent },
  { path: 'movies/star/:starId', component: BrowseMoviesComponent },
  { path: 'movies/:movieId', component: MovieDetailsPageComponent },

  // stars
  { path: 'stars/:starId', component: StarDetailsPageComponent },

  // cart & checkout
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },

  // fallback
  { path: '**', redirectTo: 'login' }
];
