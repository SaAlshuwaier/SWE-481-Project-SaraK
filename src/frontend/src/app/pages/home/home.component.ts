import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import {
  filter,
  Subscription,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError
} from 'rxjs';
 
import { GenreService } from '../../core/services/GenreService';
import { MovieService, MovieSuggestionDto } from '../../core/services/MovieService';
import { GenreDto } from '../../core/models/GenreDto';
 
type TitleFilter = string;
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
 
  constructor(
	private router: Router,
	private genreService: GenreService,
	private movieService: MovieService,
	private cdr: ChangeDetectorRef
  ) {}
 
  filters = {
	title: '',
  	year: null as number | null,  
	director: '',
	star: ''
  };
 
  genres: GenreDto[] = [];
  titleFilters: TitleFilter[] = [];
 
  yearError = '';
  searchError = '';
 
titleSuggestions: MovieSuggestionDto[] = [];
  showSuggestions = false;
 
  private routerSub?: Subscription;
  private titleInputSub?: Subscription;
  private titleInputSubject = new Subject<string>();
 
  ngOnInit(): void {
	console.log('HomeComponent ngOnInit fired');
 
	this.loadGenres();
 
	this.routerSub = this.router.events
  	.pipe(filter(event => event instanceof NavigationEnd))
  	.subscribe((event) => {
  	  const nav = event as NavigationEnd;
    	if (nav.urlAfterRedirects === '/home') {
      	console.log('NavigationEnd to /home');
      	this.loadGenres();
    	}
  	});
 
	this.titleInputSub = this.titleInputSubject.pipe(
  	debounceTime(300),
  	distinctUntilChanged(),
  	switchMap((value: string) => {
    	const trimmedValue = value.trim();
 
    	if (trimmedValue.length < 3) {
      	this.titleSuggestions = [];
      	this.showSuggestions = false;
   	   return of([]);
    	}
 
    	return this.movieService.getTitleSuggestions(trimmedValue).pipe(
      	catchError((err) => {
        	console.error('Autocomplete error:', err);
        	return of([]);
      	})
    	);
  	})
	).subscribe((suggestions: MovieSuggestionDto[]) => {
  	this.titleSuggestions = suggestions;
  	this.showSuggestions = suggestions.length > 0;
  	this.cdr.detectChanges();
	});
 
	this.titleFilters = [
  	...Array.from({ length: 10 }, (_, i) => String(i)),
  	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
	];
  }
 
  ngOnDestroy(): void {
	this.routerSub?.unsubscribe();
	this.titleInputSub?.unsubscribe();
  }
 
  get isSearchDisabled(): boolean {
	return !this.filters.title.trim() &&
         !String(this.filters.year ?? '').trim() &&
       	!this.filters.director.trim() &&
       	!this.filters.star.trim();
  }
 
  private loadGenres(): void {
	console.log('Loading genres...');
 
	this.genreService.getAllGenres().subscribe({
  	next: (genres) => {
    	console.log('Genres loaded:', genres);
    	this.genres = genres ?? [];
    	this.cdr.detectChanges();
  	},
  	error: (err) => {
  	  console.error('Error loading genres:', err);
    	this.genres = [];
    	this.cdr.detectChanges();
  	}
	});
  }
 
  onTitleInputChange(value: string): void {
	this.filters.title = value;
 
	const trimmedValue = value.trim();
 
	if (trimmedValue.length < 3) {
  	this.titleSuggestions = [];
  	this.showSuggestions = false;
  	return;
	}
 
	this.titleInputSubject.next(trimmedValue);
  }
 
  selectSuggestion(suggestion: MovieSuggestionDto): void {
  this.filters.title = suggestion.title;
  this.titleSuggestions = [];
  this.showSuggestions = false;
 
  this.router.navigate(['/movies', suggestion.id]);
}
 
  goToSearchResults(): void {
	this.yearError = '';
	this.searchError = '';
	this.showSuggestions = false;
 
	const title = this.filters.title.trim();
	const year = this.filters.year != null ? String(this.filters.year).trim() : '';
	const director = this.filters.director.trim();
	const star = this.filters.star.trim();
 
	if (!title && !year && !director && !star) {
  	this.searchError = 'Please enter at least one search field.';
  	return;
	}
 
	if (year) {
  	const parsed = Number(year);
  	const currentYear = new Date().getFullYear();
 
  	if (!Number.isInteger(parsed) || parsed < 1800 || parsed > currentYear) {
    	this.yearError = 'Year must be a valid number.';
    	return;
  	}
	}
 
	const queryParams: any = {};
 
	if (title) queryParams.title = title;
	if (year) queryParams.year = year;
	if (director) queryParams.director = director;
	if (star) queryParams.starName = star;
 
	this.router.navigate(['/movies/search'], { queryParams });
  }
 
  onClear(): void {
	this.filters = {
  	title: '',
  	year: null,
  	director: '',
	  star: ''
	};
 
	this.yearError = '';
	this.searchError = '';
	this.titleSuggestions = [];
	this.showSuggestions = false;
  }
 
  goToBrowseGenre(genre: GenreDto): void {
	this.router.navigate(['/movies/genre', genre.id], {
  	queryParams: { genreName: genre.name }
	});
  }
 
  goToBrowseTitle(startsWith: string): void {
	this.router.navigate(['/movies'], {
  	queryParams: { letter: startsWith }
	});
  }
}
