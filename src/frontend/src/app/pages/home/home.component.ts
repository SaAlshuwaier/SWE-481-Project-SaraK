import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { GenreService } from '../../core/services/GenreService';
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
    private cdr: ChangeDetectorRef
  ) {}

  filters = {
    title: '',
    year: '',
    director: '',
    star: ''
  };

  genres: GenreDto[] = [];
  titleFilters: TitleFilter[] = [];

  private routerSub?: Subscription;

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

    this.titleFilters = [
      ...Array.from({ length: 10 }, (_, i) => String(i)),
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    ];
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
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

  goToSearchResults(): void {
    const queryParams: any = {};

    if (this.filters.title.trim()) queryParams.title = this.filters.title.trim();
    if (this.filters.year.trim()) queryParams.year = this.filters.year.trim();
    if (this.filters.director.trim()) queryParams.director = this.filters.director.trim();
    if (this.filters.star.trim()) queryParams.star = this.filters.star.trim();

    this.router.navigate(['/movies/search'], { queryParams });
  }

  onClear(): void {
    this.filters = {
      title: '',
      year: '',
      director: '',
      star: ''
    };
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