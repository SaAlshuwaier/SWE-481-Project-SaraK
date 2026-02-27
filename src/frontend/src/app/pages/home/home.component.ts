import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


type TitleFilter = string;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  /*
     Router Injection
     Used to navigate from Home → Browse/Search pages
 */
  constructor(private router: Router) {}

  
  filters = {
    title: '',
    year: '',
    director: '',
    star: ''
  };

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
      ...Array.from({ length: 10 }, (_, i) => String(i)),
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    ]
  };

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

  
  ngOnInit(): void {
    this.genres = [...this.mockHomeResponse.genres];
    this.titleFilters = [...this.mockHomeResponse.titleFilters];
  }

  
  goToSearchResults() {
  const queryParams: any = {};

  if (this.filters.title.trim()) queryParams.title = this.filters.title.trim();
  if (this.filters.year.trim()) queryParams.year = this.filters.year.trim();
  if (this.filters.director.trim()) queryParams.director = this.filters.director.trim();
  if (this.filters.star.trim()) queryParams.star = this.filters.star.trim();

  this.router.navigate(['/movies/search'], { queryParams });
}

  
  onClear(): void {
    this.filters = { title: '', year: '', director: '', star: '' };
  }

  
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
}