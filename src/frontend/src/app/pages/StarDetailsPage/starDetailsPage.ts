import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { StarService } from '../../core/services/StarService';
import { StarDto } from '../../core/models/StarDto';
import { MovieDto } from '../../core/models/MovieDto';

/**
 * StarDetailsPage
 *
 * Responsibilities:
 * 1) Read starId from the URL (route param).
 * 2) Call StarService.getStar(starId) to fetch star details.
 * 3) Call StarService.getMoviesOfStar(starId) to fetch movies of the star.
 * 4) Display star info (name, birthYear).
 * 5) Display list of movies as clickable links to Movie Details page.
 */
@Component({
  selector: 'app-star-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './starDetailsPage.html',
  styleUrls: ['./starDetailsPage.css'],
})
export class StarDetailsPageComponent implements OnDestroy {

  // DELETE THIS LATER WHEN WE CONNECT TO THE DATABASE.
  private readonly MOCK_STAR: StarDto = {
    id: 'nm1719697',
    name: 'Jason Noto',
    birthYear: 1978,
  };


  private readonly MOCK_MOVIES: MovieDto[] = [
    {
      id: 'tt0476024',
      title: 'Straight Forward',
      year: 2005,
      director: 'Jason Noto',
      rating: 0,
      genres: [{ id: 9, name: 'Drama' }],
      stars: [
        { id: 'nm1719697', name: 'Jason Noto', birthYear: 1978 },
        { id: 'nm2057434', name: 'Gabe Fazio' },
        { id: 'nm2183354', name: 'Sean Duhame' },
        { id: 'nm0894448', name: 'Kristen Vermilyea', birthYear: 1969 },
        { id: 'nm2965023', name: 'Terence Ziegler'},
        { id: 'nm1164862', name: 'Lev Gorn' },
        { id: 'nm0186963', name: 'Stacia Crawford' },
      ],
    },
    {
      id: 'tt0490839',
      title: 'Charlie',
      year: 2007,
      director: 'Salvatore Interlandi',
      rating: 7.8,
      genres: [{ id: 9, name: 'Drama' }],
      stars: [
        { id: 'nm1118462', name: 'Salvatore Interlandi' },
        { id: 'nm1719697', name: 'Jason Noto', birthYear: 1978 },
        { id: 'nm1710833', name: 'Daniel Sharnoff' },
        { id: 'nm4405403', name: 'Matty Charles'},
        { id: 'nm1749019', name: 'Erik S. Weigel', birthYear: 1978 },
        { id: 'nm1496657', name: 'Adam Mcclelland' },
        { id: 'nm1651044', name: 'Tim Donovan Jr.' },
        { id: 'nm2138831', name: 'Gabriela Crocco' },
        { id: 'nm1132361', name: 'Denise Greber' },
        { id: 'nm0578815', name: 'D.J. Mendel' },
    ],
    },
  ];

  star = signal<StarDto | null>(null);
  movies = signal<MovieDto[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Keep a reference so we can unsubscribe on destroy
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private starService: StarService,
  ) {
  }

  ngOnInit(): void {
    //DELETE THIS, REMOVE COMMENT, AND IMPLEMENT LATER WHEN WE CONNECT TO THE DATABASE. THIS IS ONLY FOR DEMO PURPOSES UNTIL THEN.
    this.star.set(this.MOCK_STAR);
    this.movies.set(this.MOCK_MOVIES);
    this.isLoading.set(false);
    // Reactive subscription:
    // - Runs once immediately
    // - Runs again whenever :starId changes while component stays alive
    // this.sub.add(
    //   this.route.paramMap.subscribe((params) => {
    //     const starId = params.get('starId');

    //     if (!starId) {
    //       this.star.set(null);
    //       this.movies.set([]);
    //       this.isLoading.set(false);
    //       this.error.set('Missing starId in route.');
    //       return;
    //     }

    //     // Load star details from backend whenever starId changes
    //     this.loadStar(starId);
    //   })
    // );
}

  /**
   * Loads the star by id from backend using StarService.
   * This is separated from routing so it can be called multiple times cleanly.
   */
  private loadStar(starId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.star.set(null);
    this.movies.set([]);

    // REAL BACKEND CALLS (enable later)
    // We have two independent requests (star details + movies list),
    // so we track completion count to set isLoading=false only after both finish.
    let doneCount = 0;
    const markDone = () => {
      doneCount++;
      if (doneCount >= 2) this.isLoading.set(false);
    };

    this.starService
      .getStar(starId)
      .pipe(finalize(markDone))
      .subscribe({
        next: (res) => {
          this.star.set(res);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Failed to load star details.');
        },
      });

    this.starService
      .getMoviesOfStar(starId)
      .pipe(finalize(markDone))
      .subscribe({
        next: (res) => {
          this.movies.set(res ?? []);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Failed to load movies of star.');
        },
      });
  }

  /**
   * birthYear may be null in some datasets. Show "-" if missing.
   */
  formatBirthYear(birthYear: number | null | undefined): string {
    if (birthYear === null || birthYear === undefined) return '-';
    return `${birthYear}`;
  }

  /**
   * IMPORTANT:
   * Because we manually subscribe to paramMap, we must unsubscribe
   * when the component is destroyed to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}