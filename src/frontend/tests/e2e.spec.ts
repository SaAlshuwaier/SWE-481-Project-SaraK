import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200';

// REAL IDs that exist in DB:
const MOVIE_ID = 'tt0378947';
const STAR_ID = 'nm0591555';


// Auth tests use fresh session
test.describe('Auth tests', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

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
      await page.getByTestId('reg-confirm-password').fill(password);
      await page.getByTestId('reg-address').fill('Riyadh');
    // await page.getByTestId('reg-ccnumber').fill('0011 2233 4455 6677');
    await page.getByTestId('reg-ccnumber').fill(`4000 1234 5678 ${Date.now().toString().slice(-4)}`);
      await page.getByTestId('reg-ccexpiration').fill('2027-12-31');
      await page.getByTestId('reg-ccfirstname').fill('Jana');
      await page.getByTestId('reg-cclastname').fill('Alshreef');

      await page.getByTestId('reg-submit').click();

      // Assert no error box is shown
      //await expect(page.getByTestId('reg-error')).toHaveCount(0);
    // await expect(page.locator('body')).toContainText(/success|home|login/i);
    await expect(page.locator('body')).toContainText(/sign in|welcome back|login/i);
    });

  test('E2E: (Login) works and redirects to home', async ({ page }) => {
  const email = 'Parker234@aol.com';
  const password = 'test';

  await page.goto(`${FRONTEND_URL}/login`);

  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  // Assert no error
  await expect(page.getByTestId('login-error')).toHaveCount(0);

  // redirect
  await expect(page).toHaveURL(/home/);
});
});




//////// HOME E2E TESTS \\\\\\\

test('E2E(Home): Home page loads', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/home`);

  await expect(page.locator('body')).toContainText(/plot box|movie/i);
 // await expect(page.getByTestId('home-title')).toBeVisible();
});

//delete navigation 
  /*
  // Go to Search (from home)
  await page.getByTestId('home-go-search').click();
  await expect(page).toHaveURL(/\/movies\/search(\?.*)?$/);

  // Go back home
  await page.goto(`${FRONTEND_URL}/home`);

  // Go to Browse
  await page.getByTestId('home-go-browse').click();
  await expect(page).toHaveURL(/\/movies(\?.*)?$/);

  // Go back home
  await page.goto(`${FRONTEND_URL}/home`);

  // Go to Cart
  await page.getByTestId('home-go-cart').click();
  await expect(page).toHaveURL(/\/cart(\?.*)?$/);
}); */



//////// SEARCH MOVIES E2E TESTS \\\\\\\

test('E2E(Search): Search results page requires login and loads from query params', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies/search?title=inception&year=2010`, {
    waitUntil: 'networkidle'
  });

  await expect(page).not.toHaveURL(/\/login$/);

  await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();

  const contextBox = page.locator('.alert.alert-light.border');
  await expect(contextBox).toBeVisible();
  await expect(contextBox).toContainText('Title:');
  await expect(contextBox).toContainText('inception');
  await expect(contextBox).toContainText('2010');

  const movieCards = page.locator('.card.shadow-sm');
  const emptyState = page.getByText('No movies found.');
  const errorState = page.locator('.alert.alert-danger');

  await expect(errorState).toHaveCount(0);

  if (await movieCards.count() > 0) {
    await expect(movieCards.first()).toBeVisible();
  } else {
    await expect(emptyState).toBeVisible();
  }
});

test('E2E(Search Autocomplete): suggestions appear and selecting navigates to movie', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/home`);

  const titleInput = page.locator('input[name="title"]');

  await titleInput.fill('mel');

  await page.waitForTimeout(500);

  const suggestions = page.locator('.autocomplete-dropdown button');

  await expect(suggestions.first()).toBeVisible();

  const firstSuggestion = suggestions.first();

  const text = await firstSuggestion.textContent();

  await firstSuggestion.click();

  await expect(page).toHaveURL(/\/movies\/.+/);

  if (text) {
    await expect(page.getByTestId('movie-title')).toContainText(text.trim());
  }
});



/////// MOVIE DETAILS E2E TESTS \\\\\\\

test('E2E(Movie Details): Movie details requires login and loads from DB', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`, {
    waitUntil: 'networkidle'
  });

  // Not redirected to login
  await expect(page).not.toHaveURL(/\/login$/);

  // Assert real DB values
  await expect(page.getByTestId('movie-title')).toHaveText('Melinda and Melinda');
  await expect(page.getByTestId('movie-year')).toHaveText('2004');
  await expect(page.getByTestId('movie-director')).toHaveText('Woody Allen');
  await expect(page.getByTestId('movie-rating')).toContainText('6.5');
  await expect(page.getByTestId('movie-genres')).toContainText('Drama');
  await expect(page.getByTestId('movie-genres')).toContainText('Comedy');
  await expect(page.getByTestId('movie-genres')).toContainText('Romance');

  // quantity
  await page.getByTestId('qty-inc').click();
  await page.getByTestId('qty-inc').click();
  await expect(page.getByTestId('qty-input')).toHaveValue('3');

  // add to cart
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-error')).toHaveCount(0);

  // stars
  const starsList = page.getByTestId('stars-list');
  await expect(starsList).toBeVisible();
  await expect(starsList).toContainText('Wallace Shawn');
  await expect(starsList).toContainText('Chiwetel Ejiofor');
  await expect(starsList).toContainText('Woody Allen');

  const firstStarLink = page.getByTestId('star-link').first();
  await expect(firstStarLink).toHaveAttribute('href', /.*\/stars\/[^/]+$/);
});

//remove nav 
/*
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
});  */



/////// STAR DETAILS E2E TESTS \\\\\\\

test('E2E: Star Details loads from DB, renders fields, and has valid movie links', async ({ page }) => {

  await page.goto(`${FRONTEND_URL}/stars/${STAR_ID}`);

  // Assert real DB values
  await expect(page.getByTestId('star-name')).toHaveText('Lorenzo Minoli');

  // Movies list should be visible and contain his one known movie
  const moviesList = page.getByTestId('movies-list');
  await expect(moviesList).toBeVisible();
  await expect(moviesList).toContainText('An Italian Affair');

  // Movie link points to correct route
  const firstMovieLink = page.getByTestId('movie-link').first();
  await expect(firstMovieLink).toBeVisible();
  await expect(firstMovieLink).toHaveAttribute('href', /.*\/movies\/tt0400548$/);
});



//////// BROWSE MOVIES E2E TESTS \\\\\\\

// Verify browse by first letter/number flow works
// Example: browse movies that start with A, then browse titles starting with number 2
test('E2E(browse movies): Browse works for first letter or number', async ({ page }) => {

  // Browse by letter
  await page.goto(`${FRONTEND_URL}/movies?letter=A`, { waitUntil: 'networkidle' });
  await expect(page).not.toHaveURL(/\/login$/);

 /* await page.goto(`${FRONTEND_URL}/movies/genre/2?genreName=Action`, {
  waitUntil: 'networkidle'
});
await expect(page.locator('body')).toContainText('Browse Movies'); */
await expect(page.getByTestId('movie-card').first()).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();
  await expect(page.getByTestId('movie-link').first()).toBeVisible();
  await expect(page.getByTestId('movie-year').first()).toBeVisible();
  await expect(page.getByTestId('movie-director').first()).toBeVisible();
  await expect(page.getByTestId('movie-rating').first()).toBeVisible();

  const titlesForA = await page.getByTestId('movie-link').allTextContents();
  expect(titlesForA.length).toBeGreaterThan(0);
  expect(titlesForA.every(title => title.trim().toUpperCase().startsWith('A'))).toBeTruthy();

  // Browse by number
  await page.goto(`${FRONTEND_URL}/movies?letter=2`, { waitUntil: 'networkidle' });
  await expect(page).not.toHaveURL(/\/login$/);


await expect(page.getByTestId('movie-card').first()).toBeVisible();
  await expect(page.getByTestId('movie-card').first()).toBeVisible();
  await expect(page.getByTestId('movie-link').first()).toBeVisible();
  await expect(page.getByTestId('movie-year').first()).toBeVisible();
  await expect(page.getByTestId('movie-director').first()).toBeVisible();
  await expect(page.getByTestId('movie-rating').first()).toBeVisible();

  const titlesFor2 = await page.getByTestId('movie-link').allTextContents();
  expect(titlesFor2.length).toBeGreaterThan(0);
  expect(titlesFor2.every(title => title.trim().startsWith('2'))).toBeTruthy();
});

// Verify browse by genre flow works
// Example: click a genre link from browse page and load filtered results
test('E2E(browse movies): Browse works for Genre', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies/genre/2?genreName=Action`, {
  waitUntil: 'networkidle'
});
  await expect(page.getByTestId('browse-title')).toBeVisible();

  await expect(page.getByTestId('movie-link').first()).toBeVisible();
  await expect(page.getByTestId('movie-year').first()).toBeVisible();
  await expect(page.getByTestId('movie-director').first()).toBeVisible();
  await expect(page.getByTestId('movie-rating').first()).toBeVisible();

  await expect(page.getByTestId('movie-card').first()).toBeVisible();
});

// Verify movies page loads and movies are displayed
// Example: open /movies page and confirm at least one movie card appears
test('E2E(browse movies): Movies page opens and movies load', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies`);

  await expect(page).toHaveURL(/movies/);

  await expect(page.locator('body')).toContainText('Browse Movies');

  await expect(page.getByTestId('movie-card').first()).toBeVisible();
});

// Verify sorting control works
// Example: change sorting from Title to Rating and verify dropdown responds
test('E2E(browse movies): Sort dropdown exists and can change', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies`);

  const sort = page.locator('select').first();

  await expect(sort).toBeVisible();

  await sort.selectOption({ index: 1 });
});

// Verify movie details page loads
// Example: open first movie page, then confirm star links are visible
test('E2E(browse movies): Movie and star links navigate', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/movies`);

  const movie = page.getByTestId('movie-link').first();
  await movie.click();

  await expect(page).toHaveURL(/\/movies\/tt/);

  const star = page.getByTestId('star-link').first();
  await expect(star).toBeVisible();
});



/////// CHECKOUT E2E TESTS \\\\\\\

test('E2E: Cart page loads, Load Cart works, update/delete work, clear local works, navigation works', async ({ page }) => {
  // Go to Cart page
  await page.goto(`${FRONTEND_URL}/cart`);
  await page.waitForTimeout(1000);
  
  // Clear any leftover cart state from previous tests  
  const clearBtn = page.getByTestId('clear-cart');
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
  }

  // There should be no cart error after loading
  await expect(page.getByTestId('cart-error')).toHaveCount(0);

  // Cart should now be visible + total quantity rendered
  await expect(page.getByTestId('cart-loaded')).toBeVisible();
  
  await expect(page.getByTestId('proceed-checkout')).toBeVisible();

  // Should be disabled when cart is empty
  await expect(page.getByTestId('proceed-checkout')).toBeDisabled();

  await expect(page.getByTestId('cart-total-qty')).toHaveText('0');
  await expect(page.getByTestId('cart-empty')).toBeVisible();

  // Add an item so checkout becomes available
  await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`);
 // await page.getByTestId('add-to-cart').click();
  //await page.goto(`${FRONTEND_URL}/cart`);
  await page.getByTestId('add-to-cart').click();
await page.waitForTimeout(1000);
await page.goto(`${FRONTEND_URL}/cart`);
  await expect(page.getByTestId('cart-loaded')).toBeVisible();
  await expect(page.getByTestId('proceed-checkout')).toBeEnabled();

  const rows = page.getByTestId('cart-row');
  const rowCount = await rows.count();

  if (rowCount > 0) {
    const firstQtyInput = page.getByTestId('cart-qty-input').first();

    const oldVal = await firstQtyInput.inputValue();

    const newVal = oldVal === '2' ? '3' : '2';

    await firstQtyInput.fill(newVal);

    await firstQtyInput.blur();

    await expect(page.getByTestId('cart-error')).toHaveCount(0);

    await page.getByTestId('remove-item').first().click();

    await expect(page.getByTestId('cart-error')).toHaveCount(0);
  }

  // Clear cart locally
  await page.getByTestId('clear-cart').click();

  // After local clear, empty cart message should appear
  await expect(page.getByTestId('cart-empty')).toBeVisible();
});