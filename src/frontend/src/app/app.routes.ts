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
import { authGuard } from './guards/auth-guard';
export const routes: Routes = [

  // default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // authentication
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },

  // home
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  // movies
  { path: 'movies', component: BrowseMoviesComponent, canActivate: [authGuard]  },
  { path: 'movies/search', component: SearchMoviesComponent, canActivate: [authGuard]  },
  { path: 'movies/genre/:genreId', component: BrowseMoviesComponent, canActivate: [authGuard]  },
  { path: 'movies/:movieId', component: MovieDetailsPageComponent, canActivate: [authGuard]  },

  // stars
  { path: 'stars/:starId', component: StarDetailsPageComponent, canActivate: [authGuard]  },

  // cart & checkout
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard]  },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard]  },

  // fallback
  { path: '**', redirectTo: 'login' }
];
