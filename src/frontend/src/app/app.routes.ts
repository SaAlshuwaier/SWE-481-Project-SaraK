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
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // home
  { path: 'home', component: HomeComponent },

  // search page (separate)
  { path: 'movies/search', component: SearchMoviesComponent },

  // details
  { path: 'movies/:movieId', component: MovieDetailsPageComponent },
  { path: 'stars/:starId', component: StarDetailsPageComponent },

  // browse pages
  { path: 'movies', component: BrowseMoviesComponent },
  { path: 'movies/genre/:genreId', component: BrowseMoviesComponent },
  { path: 'movies/star/:starId', component: BrowseMoviesComponent },
  // cart
{ path: 'cart', component: CartPageComponent },
// auth
 { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
// 
  { path: 'checkout', component: CheckoutPageComponent },
  // fallback
  { path: '**', redirectTo: 'home' },
];
