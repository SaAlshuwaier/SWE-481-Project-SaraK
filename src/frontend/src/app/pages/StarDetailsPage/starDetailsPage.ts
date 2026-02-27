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
    id: 'nm1636964',
    name: 'Phantom Artsy',
    birthYear: 1970,
  };


  // Movies list returned from GET /api/stars/{starId}/movies DELETE THIS LATER
  private readonly MOCK_MOVIES: MovieDto[] = [
    {
      id: 'tt0413051',
      title: 'No Longer My Twin',
      year: 2002,
      director: 'Robert G. Christie',
      rating: 1.4,
      genres: [{ id: 16, name: 'Mystery' }],
      stars: [],
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