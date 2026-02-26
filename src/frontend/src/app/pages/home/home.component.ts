<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
/* =========================
   Angular Core Imports
========================= */
import { Component, OnInit } from '@angular/core';

/* =========================
   Angular Modules
   - CommonModule: *ngFor, *ngIf
   - FormsModule: [(ngModel)]
   - RouterModule: routerLink
========================= */
>>>>>>> db7453d (Final updates)
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

<<<<<<< HEAD

=======
/* =========================
   Custom Type: TitleFilter
   (A–Z or 0–9) used for browsing by first character
========================= */
>>>>>>> db7453d (Final updates)
type TitleFilter = string;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

<<<<<<< HEAD
  /*
     Router Injection
     Used to navigate from Home → Browse/Search pages
 */
  constructor(private router: Router) {}

  
=======
  /* =========================
     Constructor: Router Injection
     We only navigate from Home → /movies
  ========================= */
  constructor(private router: Router) {}

  /* =========================
     UI Model: Search Filters
     Stored locally in Home page only
  ========================= */
>>>>>>> db7453d (Final updates)
  filters = {
    title: '',
    year: '',
    director: '',
    star: ''
  };

<<<<<<< HEAD
  /* 
     Data shown in UI
     Loaded from mock response (simulated DB/API)
   */
  genres: string[] = [];
  titleFilters: TitleFilter[] = [];

  /* 
     Mock Response (Simulated DB/API)
     We "map" it in ngOnInit instead of hard-coding UI arrays directly.
   */
=======
  /* =========================
     Data shown in UI
     IMPORTANT: Not hard-coded directly.
     They will be loaded from mock response below.
  ========================= */
  genres: string[] = [];
  titleFilters: TitleFilter[] = [];

  /* =========================
     Mock Response (Simulated API/DB)
     This represents what we expect to receive later
     from backend/service (Phase 4 integration).
  ========================= */
>>>>>>> db7453d (Final updates)
  private readonly mockHomeResponse: {
    genres: string[];
    titleFilters: TitleFilter[];
  } = {
    genres: [
      'Action','Adult','Adventure','Animation','Biography','Comedy','Crime',
      'Documentary','Drama','Family','Fantasy','History','Horror',
      'Music','Musical','Mystery','Reality-TV','Romance','Sci-Fi','Sport',
      'Thriller','War','Western'
    ],
    titleFilters: [
<<<<<<< HEAD
      ...Array.from({ length: 10 }, (_, i) => String(i)),
=======
      // 0–9
      ...Array.from({ length: 10 }, (_, i) => String(i)),
      // A–Z
>>>>>>> db7453d (Final updates)
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    ]
  };

<<<<<<< HEAD
  /* 
     Genre Mapping (Name → ID)
   */
  private readonly genreNameToId: Record<string, number> = {
    Action: 2,
    Adult: 3,
    Adventure: 4,
    Animation: 5,
    Biography: 6,
    Comedy: 7,
    Crime: 8,
    Documentary: 9,
    Drama: 10,
    Family: 11,
    Fantasy: 12,
    History: 13,
    Horror: 14,
    Music: 15,
    Musical: 16,
    Mystery: 17,
    'Reality-TV': 18,
    Romance: 19,
    'Sci-Fi': 20,
    Sport: 21,
    Thriller: 22,
    War: 23,
    Western: 24
  };

  
=======
  /* =========================
     Lifecycle: ngOnInit
     "Maps" mock response into UI variables
  ========================= */
>>>>>>> db7453d (Final updates)
  ngOnInit(): void {
    this.genres = [...this.mockHomeResponse.genres];
    this.titleFilters = [...this.mockHomeResponse.titleFilters];
  }

<<<<<<< HEAD
  
  goToSearchResults() {
  const queryParams: any = {};

  if (this.filters.title.trim()) queryParams.title = this.filters.title.trim();
  if (this.filters.year.trim()) queryParams.year = this.filters.year.trim();
  if (this.filters.director.trim()) queryParams.director = this.filters.director.trim();
  if (this.filters.star.trim()) queryParams.star = this.filters.star.trim();

  this.router.navigate(['/movies/search'], { queryParams });
}

  
=======
  /* =========================
     🔎 Search Navigation
     Builds query params from filled fields only
     Then navigates to /movies
  ========================= */
  goToSearchResults(): void {
    const queryParams: Record<string, string> = {};

    const title = this.filters.title.trim();
    const year = this.filters.year.trim();
    const director = this.filters.director.trim();
    const star = this.filters.star.trim();

    if (title) queryParams['title'] = title;
    if (year) queryParams['year'] = year;
    if (director) queryParams['director'] = director;

    // IMPORTANT: use starName (matches backend parameter)
    if (star) queryParams['starName'] = star;

    this.router.navigate(['/movies'], { queryParams });
  }

  /* =========================
     🧹 Clear Filters (UI Only)
  ========================= */
>>>>>>> db7453d (Final updates)
  onClear(): void {
    this.filters = { title: '', year: '', director: '', star: '' };
  }

<<<<<<< HEAD
  
  goToBrowseGenre(genreName: string): void {
    const genreId = this.genreNameToId[genreName];

    // If mapping missing, fall back to browse all
    if (!genreId) {
      this.router.navigate(['/movies']);
      return;
    }

    this.router.navigate(['/movies/genre', genreId], {
      queryParams: { genreName }
    });
  }

  
  goToBrowseTitle(startsWith: string): void {
  this.router.navigate(['/movies'], { queryParams: { letter: startsWith } });
}
=======
  /* =========================
     🎭 Browse by Genre
     Navigates to /movies?genre=<GenreName>
  ========================= */
  goToBrowseGenre(genreName: string): void {
    this.router.navigate(['/movies'], { queryParams: { genre: genreName } });
  }

  /* =========================
     🔠 Browse by Title
     Navigates to /movies?startsWith=<A|B|0...>
  ========================= */
  goToBrowseTitle(startsWith: TitleFilter): void {
    this.router.navigate(['/movies'], { queryParams: { startsWith } });
  }
>>>>>>> db7453d (Final updates)
}