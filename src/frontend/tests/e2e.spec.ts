import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200';

// REAL IDs that exist in DB:
const MOVIE_ID = 'tt0378947';
const STAR_ID  = 'nm0591555';

test('E2E: Movie Details loads from DB, renders fields, star links look correct, cart works, back works', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`);

  // Assert real DB values
  await expect(page.getByTestId('movie-title')).toHaveText('Melinda and Melinda');
  await expect(page.getByTestId('movie-year')).toHaveText('2004');
  await expect(page.getByTestId('movie-director')).toHaveText('Woody Allen');
  await expect(page.getByTestId('movie-rating')).toHaveText('6.5');
  await expect(page.getByTestId('movie-genres')).toContainText('Drama');
  await expect(page.getByTestId('movie-genres')).toContainText('Comedy');
  await expect(page.getByTestId('movie-genres')).toContainText('Romance');

  // quantity: click + twice -> 3
  await page.getByTestId('qty-inc').click();
  await page.getByTestId('qty-inc').click();
  await expect(page.getByTestId('qty-input')).toHaveValue('3');

  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-error')).toHaveCount(0);

  // Stars list should be visible and contain stars
  const starsList = page.getByTestId('stars-list');
  await expect(starsList).toBeVisible();
  await expect(starsList).toContainText('Wallace Shawn');
  await expect(starsList).toContainText('Chiwetel Ejiofor');
  await expect(starsList).toContainText('Woody Allen');

  // Star links point to correct route
  const firstStarLink = page.getByTestId('star-link').first();
  await expect(firstStarLink).toHaveAttribute('href', new RegExp(`.*/stars/[^/]+$`));

  // Back to Movies works
  await page.getByTestId('back-to-movies').click();
  await expect(page).toHaveURL(/\/movies(\?.*)?$/);
});

test('E2E: Star Details loads from DB, renders fields, and has valid movie links', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/stars/${STAR_ID}`);

  // Assert real DB values
  await expect(page.getByTestId('star-name')).toHaveText('Lorenzo Minoli');
  // No birthYear in DB, so assert it's not shown OR shows a fallback
  await expect(page.getByTestId('star-birthyear')).toHaveText('-'); // adjust to whatever your UI shows for null

  // Movies list should be visible and contain his one known movie
  const moviesList = page.getByTestId('movies-list');
  await expect(moviesList).toBeVisible();
  await expect(moviesList).toContainText('An Italian Affair'); 

  // Movie link points to correct route
  const firstMovieLink = page.getByTestId('movie-link').first();
  await expect(firstMovieLink).toBeVisible();
  await expect(firstMovieLink).toHaveAttribute('href', /.*\/movies\/tt0400548$/);

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

  // Browse by number
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
  await expect(page.getByTestId('movie-link')).toBeVisible();
  await expect(page.getByTestId('movie-year')).toBeVisible();
  await expect(page.getByTestId('movie-director')).toBeVisible();
  await expect(page.getByTestId('movie-rating')).toBeVisible();
  await expect(page.getByTestId('genre-link')).toBeVisible();
  await expect(page.getByTestId('star-link')).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();

  const genreLinks = page.getByTestId('genre-link');
  await expect(genreLinks).toContainText('Action');

});

test('E2E(browse movies): Browse all movies works, Pagination works', async ({ page }) => {
  // Browse all
  await page.goto(`${FRONTEND_URL}/movies`);

  await expect(page.getByTestId('browse-title')).toBeVisible();
  await expect(page.getByTestId('context-title')).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();

  //Pagination
  const nextBtn = page.getByTestId('next-btn');
  if (await nextBtn.isEnabled()) {
    await nextBtn.click();
    await expect(page.getByTestId('page-number')).toContainText('Page');
  }
});

test('E2E(browse movies): Sorting works', async ({ page }) => {

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

test('E2E: Cart page loads, Load Cart works, update/delete work, clear local works, navigation works', async ({ page }) => {
  // Go to Cart page
  await page.goto(`${FRONTEND_URL}/cart`);

  // Initially, cart should NOT be loaded yet
  await expect(page.getByTestId('cart-not-loaded')).toBeVisible();
  await expect(page.getByTestId('load-cart')).toBeVisible();

  // Click "Load Cart" to fetch cart from backend
  await page.getByTestId('load-cart').click();

  // There should be no cart error after loading
  await expect(page.getByTestId('cart-error')).toHaveCount(0);

  // Cart should now be visible + total quantity rendered
  await expect(page.getByTestId('cart-loaded')).toBeVisible();

  // NOTE for future implementation:
// This test currently assumes the cart starts empty (total quantity = 0).
// If the backend later returns cart items by default, this assertion may fail because it expects '0'. In that case, the test should be updated to match the real backend behavior.
// In that case, the test should be updated to match the real backend behavior, so we delete : await expect(page.getByTestId('cart-total-qty')).toHaveText('0');
 await expect(page.getByTestId('cart-total-qty')).toHaveText('0');
await expect(page.getByTestId('cart-empty')).toBeVisible();

  // If cart has items, test update and delete behaviors
  const rows = page.getByTestId('cart-row');
  const rowCount = await rows.count();

  if (rowCount > 0) {
    //  Update quantity for the first item 
    const firstQtyInput = page.getByTestId('cart-qty-input').first();

    // Read current input value
    const oldVal = await firstQtyInput.inputValue();

    // Choose a new value different from the old value
    const newVal = oldVal === '2' ? '3' : '2';

    // Fill new value (triggers Angular (input) handler)
    await firstQtyInput.fill(newVal);

    // Blur helps stability across browsers and ensures events settle
    await firstQtyInput.blur();

    // No error after update
    await expect(page.getByTestId('cart-error')).toHaveCount(0);

    // --- Delete the first item ---
    await page.getByTestId('remove-item').first().click();

    // No error after delete
    await expect(page.getByTestId('cart-error')).toHaveCount(0);
  }

  // Clear cart locally 
  await page.getByTestId('clear-cart').click();

  // After local clear, empty cart message should appear
  await expect(page.getByTestId('cart-empty')).toBeVisible();

  // Footer navigation should exist
   // Continue Shopping should route to /movies
  await page.getByTestId('continue-shopping').click();
  await expect(page).toHaveURL(/\/movies(\?.*)?$/);

  // Proceed to Checkout should route to /checkout
  // We navigate back to /cart, so we MUST load the cart again because the footer
  // (continue-shopping / proceed-checkout) is rendered only when cart() exists.
  await page.goto(`${FRONTEND_URL}/cart`);

  await expect(page.getByTestId('load-cart')).toBeVisible();
  await page.getByTestId('load-cart').click();

  await expect(page.getByTestId('cart-loaded')).toBeVisible();
  await expect(page.getByTestId('proceed-checkout')).toBeVisible();

  await page.getByTestId('proceed-checkout').click();
  await expect(page).toHaveURL(/\/checkout(\?.*)?$/);
});


// E2E Auth Tests:
// These tests validate the full user authentication flow from the UI.
// I generate a unique email on each run to avoid dependency on "seed" data
// and to prevent "user already exists" errors.
// The tests verify that:
// 1) Registration succeeds and shows the success response.
// 2) Login succeeds using the newly created account.
// Note: This approach keeps the tests stable even if the database state changes.
test('E2E: Register works and shows success response', async ({ page }) => {
  // Use unique email each run to avoid "already exists"
  const email = `e2e_${Date.now()}@test.com`;
  const password = 'test123';

  await page.goto(`${FRONTEND_URL}/register`);

  await expect(page.getByTestId('register-title')).toBeVisible();

  await page.getByTestId('reg-firstname').fill('Jana');
  await page.getByTestId('reg-lastname').fill('Alshreef');
  await page.getByTestId('reg-email').fill(email);
  await page.getByTestId('reg-password').fill(password);
  await page.getByTestId('reg-address').fill('Riyadh');
  await page.getByTestId('reg-ccid').fill('1111222233334444');

  await page.getByTestId('reg-submit').click();

  // Assert no error box is shown
  await expect(page.getByTestId('reg-error')).toHaveCount(0);

  // Assert success response is shown
  await expect(page.getByTestId('reg-success')).toBeVisible();
  await expect(page.getByTestId('reg-success-message')).toContainText('User registered successfully');
});

test('E2E: Login works and shows success response', async ({ page }) => {
  // Create a new user first (so we do not rely on seed data)
  const email = `e2e_${Date.now()}@test.com`;
  const password = 'test123';

  // Register
  await page.goto(`${FRONTEND_URL}/register`);
  await page.getByTestId('reg-firstname').fill('Jana');
  await page.getByTestId('reg-lastname').fill('Alshreef');
  await page.getByTestId('reg-email').fill(email);
  await page.getByTestId('reg-password').fill(password);
  await page.getByTestId('reg-address').fill('Riyadh');
  await page.getByTestId('reg-ccid').fill('1111222233334444');
  await page.getByTestId('reg-submit').click();

  await expect(page.getByTestId('reg-error')).toHaveCount(0);
  await expect(page.getByTestId('reg-success')).toBeVisible();

  // Login with the same credentials
  await page.goto(`${FRONTEND_URL}/login`);

  await expect(page.getByTestId('login-title')).toBeVisible();

  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  // Assert no error
  await expect(page.getByTestId('login-error')).toHaveCount(0);

  // Assert success response box appears
  await expect(page.getByTestId('login-success')).toBeVisible();
  await expect(page.getByTestId('login-success-message')).toContainText('Login successful');
});