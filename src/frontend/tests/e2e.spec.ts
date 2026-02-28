import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200';

// REAL IDs that exist in DB:
const MOVIE_ID = 'tt0378947';
const STAR_ID  = 'nm1636964';

test('E2E: Movie Details loads from DB, renders fields, star links look correct, cart works, back works', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`);

  await expect(page.getByTestId('movie-title')).toBeVisible();
  await expect(page.getByTestId('movie-year')).toBeVisible();
  await expect(page.getByTestId('movie-director')).toBeVisible();
  await expect(page.getByTestId('movie-rating')).toBeVisible();
  await expect(page.getByTestId('movie-genres')).toBeVisible();

  // quantity: click + twice -> 3
  await page.getByTestId('qty-inc').click();
  await page.getByTestId('qty-inc').click();
  await expect(page.getByTestId('qty-input')).toHaveValue('3');

  await page.getByTestId('add-to-cart').click();

  // cart error should NOT appear
  await expect(page.getByTestId('cart-error')).toHaveCount(0);

  // stars list exists OR "No stars found."
  const starsList = page.getByTestId('stars-list');
  const noStars = page.getByTestId('no-stars');
  await expect(starsList.or(noStars)).toBeVisible();

  // If stars exist, verify the first link points to the nested route
  if (await starsList.isVisible().catch(() => false)) {
    const firstStarLink = page.getByTestId('star-link').first();
    await expect(firstStarLink).toBeVisible();

    // hyperlink correctness without navigating
    await expect(firstStarLink).toHaveAttribute(
      'href',
      new RegExp(`.*/movies/${MOVIE_ID}/stars/[^/]+$`)
    );
  }

  // Back to Movies works
  await page.getByTestId('back-to-movies').click();
  await expect(page).toHaveURL(/\/movies(\?.*)?$/);
});

test('E2E: Star Details loads from DB, renders fields, and has valid movie links', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/stars/${STAR_ID}`);

  await expect(page.getByTestId('star-name')).toBeVisible();
  await expect(page.getByTestId('star-birthyear')).toBeVisible();

  // movies list exists OR "No movies found."
  const moviesList = page.getByTestId('movies-list');
  const noMovies = page.getByTestId('no-movies');
  await expect(moviesList.or(noMovies)).toBeVisible();

  // If movies exist, verify the first link points to /movies/:movieId
  if (await moviesList.isVisible().catch(() => false)) {
    const firstMovieLink = page.getByTestId('movie-link').first();
    await expect(firstMovieLink).toBeVisible();

    // hyperlink correctness without navigating
    await expect(firstMovieLink).toHaveAttribute('href', /.*\/movies\/[^/]+$/);
  }

  // Back to Movies works
  await page.getByTestId('back-to-movies').click();
  await expect(page).toHaveURL(/\/movies(\?.*)?$/);
});

test('E2E: Navigation flow Movie -> Star -> Movie works', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`);

  const starsList = page.getByTestId('stars-list');
  await expect(starsList).toBeVisible();

  const firstStarLink = page.getByTestId('star-link').first();
  await expect(firstStarLink).toBeVisible();
  await firstStarLink.click();

  await expect(page).toHaveURL(/\/stars\/[^/]+$/);
  await expect(page.getByTestId('star-name')).toBeVisible();

  const moviesList = page.getByTestId('movies-list');
  await expect(moviesList).toBeVisible();

  const firstMovieLink = page.getByTestId('movie-link').first();
  await expect(firstMovieLink).toBeVisible();
  await firstMovieLink.click();

  await expect(page).toHaveURL(/\/movies\/[^/]+$/);
  await expect(page.getByTestId('movie-title')).toBeVisible();

});

test('E2E(browse movies): Browse works for first letter or number', async ({ page }) => {

  // Browse by Letter
  await page.goto(`${FRONTEND_URL}/movies?letter=A`);

  await expect(page.getByTestId('browse-title')).toBeVisible();
  await expect(page.getByTestId('movie-link')).toBeVisible();
  await expect(page.getByTestId('movie-year')).toBeVisible();
  await expect(page.getByTestId('movie-director')).toBeVisible();
  await expect(page.getByTestId('movie-rating')).toBeVisible();
  await expect(page.getByTestId('genre-link')).toBeVisible();
  await expect(page.getByTestId('star-link')).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();

  const firstTitleLetter = await page.getByTestId('movie-link').first().textContent();
  expect(firstTitleLetter?.toUpperCase().startsWith('A')).toBeTruthy();

  // Browse by Letter
  await page.goto(`${FRONTEND_URL}/movies?letter=2`);

  await expect(page.getByTestId('browse-title')).toBeVisible();
  await expect(page.getByTestId('movie-link')).toBeVisible();
  await expect(page.getByTestId('movie-year')).toBeVisible();
  await expect(page.getByTestId('movie-director')).toBeVisible();
  await expect(page.getByTestId('movie-rating')).toBeVisible();
  await expect(page.getByTestId('genre-link')).toBeVisible();
  await expect(page.getByTestId('star-link')).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();

  const firstTitleNumber = await page.getByTestId('movie-link').first().textContent();
  expect(firstTitleNumber?.startsWith('2')).toBeTruthy();
});

test('E2E(browse movies): Browse works for Genre', async ({ page }) => {

  // Browse by Genre
  await page.goto(`${FRONTEND_URL}/movies/genre/2?genreName=Action`);

  await expect(page.getByTestId('browse-title')).toBeVisible();
  await expect(page.getByTestId('context-title')).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();

});

test('E2E(browse movies): Sorting and Pagination work', async ({ page }) => {

  await page.goto(`${FRONTEND_URL}/movies`);

  const getTitles = async () => {
    return await page.getByTestId('movie-link').allInnerTexts();
  };

  const originalOrder = await getTitles();

  const sortTypes = ['year', 'director', 'star'];

  for (const type of sortTypes) {

    await page.getByTestId('sort-select').selectOption(type);


    await expect(page.getByTestId('movie-card')).toHaveCount(4);

    const newOrder = await getTitles();

    expect(newOrder).not.toEqual(originalOrder);

    //return to normal sort
    await page.getByTestId('sort-select').selectOption('title');
    await expect(page.getByTestId('movie-card')).toHaveCount(4);


    //Pagination
    const nextBtn = page.getByTestId('next-btn');
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.getByTestId('page-number')).toContainText('Page');
    }
  }
});

test('E2E(browse movies): Navigation Movie, Star, and Genre links work', async ({ page }) => {

  await page.goto(`${FRONTEND_URL}/movies`);


  //  Genre Navigation
  const firstGenre = page.getByTestId('genre-link').first();
  await expect(firstGenre).toBeVisible();
  await firstGenre.click();

  await expect(page).toHaveURL(/\/movies\/genre\/[^/]+/);
  await expect(page.getByTestId('browse-title')).toBeVisible();

  // Go back to movies list
  await page.goto(`${FRONTEND_URL}/movies`);

  // Movie Navigation
  const firstMovie = page.getByTestId('movie-link').first();
  await expect(firstMovie).toBeVisible();
  await firstMovie.click();

  await expect(page).toHaveURL(/\/movies\/[^/]+$/);
  await expect(page.getByTestId('movie-title')).toBeVisible();

  //  Star Navigation
  const firstStar = page.getByTestId('star-link').first();
  await expect(firstStar).toBeVisible();
  await firstStar.click();

  await expect(page).toHaveURL(/\/stars\/[^/]+/);
  await expect(page.getByTestId('star-name')).toBeVisible();

});
