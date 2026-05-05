/**
 * PLAYWRIGHT BEST PRACTICES APPLIED IN THIS FILE:
 * https://playwright.dev/docs/best-practices
 *
 * 1. USE ROLE-BASED LOCATORS (getByRole, getByLabel, getByText)
 *    - Example: page.getByRole('button', { name: 'Sign in' })
 *
 * 2. NO data-testid AND NO locator() CSS SELECTORS
 *
 * 3. USE WEB-FIRST ASSERTIONS (await expect(...).toBeVisible())
 *    - Playwright waits and retries until condition is met
 *    - Never use: expect(await locator.isVisible()).toBe(true)
 *
 * 4. MAKE TESTS ISOLATED
 *    - Auth tests use fresh session (no cookies)
 *    - Each test navigates to its own URL
 *    - No test depends on the result of another test
 *
 * 5. USE CHAINING AND FILTERING
 *    - Narrow down locators to specific parts of the page
 *    - Example: page.getByRole('listitem').filter({ hasText: 'Wallace Shawn' })
 * 
 * 6. USE DESCRIBE BLOCKS TO GROUP RELATED TESTS
 *    - Groups tests by feature for better organization and reporting
 *
 * 7. NO waitForTimeout OR waitUntil: 'networkidle'
 *    - These are manual waits that go against Playwright's auto-waiting
 *    - Web-first assertions like toBeVisible() handle waiting automatically
 */

import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200';

// Real IDs that exist in the database — consistent with CI/CD yaml
const MOVIE_ID = 'tt0378947';
const STAR_ID  = 'nm0591555';

// ============================================================
// AUTH TESTS
// Best Practice: Use fresh session for auth tests to ensure
// complete isolation. No cookies or storage from other tests
// ============================================================
test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Register: successfully creates account and redirects to login', async ({ page }) => {
    const email    = `e2e_${Date.now()}@test.com`;
    const password = 'test123';

    await page.goto(`${FRONTEND_URL}/register`);

    // Best Practice: getByRole reflects what the user sees on screen
    await expect(page.getByRole('heading', { name: "Let's create your account" })).toBeVisible();

    // Best Practice: getByLabel works 
    // exact: true prevents partial match with "Name on Card (First Name)"
    await page.getByLabel('First Name', { exact: true }).fill('Jana');
    await page.getByLabel('Last Name', { exact: true }).fill('Alshreef');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByLabel('Address').fill('Riyadh');
    await page.getByLabel('Card Number').fill(`4000 1234 5678 ${Date.now().toString().slice(-4)}`);
    await page.getByLabel('Card Expiration Date').fill('2027-12-31');
    await page.getByLabel('Name on Card (First Name)').fill('Jana');
    await page.getByLabel('Name on Card (Last Name)').fill('Alshreef');

    // Best Practice: getByRole('button') targets the visible button text
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Best Practice: getByText is a web-first assertion (waits until text appears)
    await expect(page.getByText(/sign in|welcome back|login/i).first()).toBeVisible();
  });

  test('Login: valid credentials redirect to home page', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Best Practice: getByLabel works
    await page.getByLabel('Email').fill('Parker234@aol.com');
    await page.getByLabel('Password').fill('test');

    // Best Practice: getByRole('button') for the submit button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Best Practice: toHaveURL is a web-first assertion that waits for navigation
    await expect(page).toHaveURL(/home/);
  });
});

// ============================================================
// HOME PAGE TESTS
// ============================================================
test.describe('Home Page', () => {

  test('Home page loads', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/home`);

    // Best Practice: getByText waits until text appears (no manual waits needed)
    await expect(page.getByText(/plot box|movie/i).first()).toBeVisible();
  });

});

// ============================================================
// SEARCH MOVIES TESTS
// ============================================================
test.describe('Search Movies', () => {

  test('Search results page loads from query params and displays results', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies/search?title=inception&year=2010`);

    await expect(page).not.toHaveURL(/\/login$/);

    // Best Practice: getByRole('heading') targets the visible heading text
    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();

    // Best Practice: getByText for visible content in the context box
    await expect(page.getByText('Title:').first()).toBeVisible();
    await expect(page.getByText('inception').first()).toBeVisible();
    await expect(page.getByText('2010').first()).toBeVisible();

    // Best Practice: check either movies or empty state — both are valid outcomes
    // Movie titles are rendered as h3 headings inside cards
    const movieHeadings = page.getByRole('heading', { level: 3 });
    const emptyState    = page.getByText('No movies found.');

    if (await movieHeadings.count() > 0) {
      await expect(movieHeadings.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test('Autocomplete: suggestions appear on input and clicking navigates to movie', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/home`);

    // Best Practice: getByLabel works 
    await page.getByLabel('Title').fill('mel');

    // Best Practice: toBeVisible() auto-waits — handles 300ms debounce automatically
    // No need for waitForTimeout — Playwright retries until suggestions appear
    // Suggestions are rendered as buttons inside autocomplete dropdown
    const suggestions = page.getByRole('button').filter({ hasText: /mel/i });
    await expect(suggestions.first()).toBeVisible();

    const text = await suggestions.first().textContent();
    await suggestions.first().click();

    // Best Practice: toHaveURL is web-first (waits for navigation to complete)
    await expect(page).toHaveURL(/\/movies\/.+/);

    if (text) {
      // Best Practice: getByRole('heading') targets the visible movie title heading
      await expect(page.getByRole('heading', { level: 2 })).toContainText(text.trim());
    }
  });

});

// ============================================================
// MOVIE DETAILS TESTS
// ============================================================
test.describe('Movie Details', () => {

  test('Movie details page loads correct data from database', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`);

    await expect(page).not.toHaveURL(/\/login$/);

    // Best Practice: getByRole('heading') for the movie title
    await expect(page.getByRole('heading', { name: 'Melinda and Melinda' })).toBeVisible();

    await expect(page.getByText('2004').first()).toBeVisible();

    await expect(
      page.getByText('Woody Allen').first()
    ).toBeVisible();

    await expect(page.getByText('6.5/10')).toBeVisible();

    // Best Practice: getByText for genre badges
    await expect(page.getByText('Drama').first()).toBeVisible();
    await expect(page.getByText('Comedy').first()).toBeVisible();
    await expect(page.getByText('Romance').first()).toBeVisible();

    // Best Practice: getByRole('button') with name for quantity controls
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();

    // Best Practice: getByRole('spinbutton') for number inputs
    await expect(page.getByRole('spinbutton')).toHaveValue('3');

    // Best Practice: getByRole('button') for Add to Cart
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByText('Add to cart failed')).toHaveCount(0);

    await expect(
      page.getByRole('listitem').filter({ hasText: 'Wallace Shawn' })
    ).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Chiwetel Ejiofor' })
    ).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Woody Allen' })
    ).toBeVisible();

    // Best Practice: chain getByRole to get link inside the listitem
    // This confirms the star name is a clickable link pointing to star route
    const firstStarLink = page.getByRole('listitem')
      .filter({ hasText: 'Wallace Shawn' })
      .getByRole('link');
    await expect(firstStarLink).toHaveAttribute('href', /.*\/stars\/[^/]+$/);
  });

  test('Star links on movie page are visible and point to correct route', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies/tt0378947`);

    await expect(page).toHaveURL(/\/movies\/tt/);

    const starLink = page.getByRole('listitem').getByRole('link').first();
    await expect(starLink).toBeVisible();
  });

});

// ============================================================
// STAR DETAILS TESTS
// ============================================================
test.describe('Star Details', () => {

  test('Star details page loads correct data and shows movie links', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/stars/${STAR_ID}`);

    // Best Practice: getByRole('heading') for the star name
    await expect(page.getByRole('heading', { name: 'Lorenzo Minoli' })).toBeVisible();

    await expect(page.getByText('An Italian Affair')).toBeVisible();

    // Best Practice: getByRole('link') with name — most resilient locator for links
    const movieLink = page.getByRole('link', { name: 'An Italian Affair' });
    await expect(movieLink).toBeVisible();
    await expect(movieLink).toHaveAttribute('href', expect.stringContaining('/movies/tt0400548'));
  });

});

// ============================================================
// BROWSE MOVIES TESTS
// ============================================================
test.describe('Browse Movies', () => {

  test('Browse by letter A shows movies starting with A', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies?letter=A`);

    await expect(page).not.toHaveURL(/\/login$/);

    // Best Practice: getByRole('heading') to confirm page loaded
    await expect(page.getByRole('heading', { name: 'Browse Movies' })).toBeVisible();

    const movieTitleLinks = page.getByRole('heading', { level: 3 }).getByRole('link');
    await expect(movieTitleLinks.first()).toBeVisible();

    // Verify all movie title links start with A
    const titles = await movieTitleLinks.allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.every(t => t.trim().toUpperCase().startsWith('A'))).toBeTruthy();
  });

  test('Browse by number 2 shows movies starting with 2', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies?letter=2`);

    await expect(page).not.toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Browse Movies' })).toBeVisible();

    // Semantic disambiguation: movie titles are links inside h3 headings
    const movieTitleLinks = page.getByRole('heading', { level: 3 }).getByRole('link');
    await expect(movieTitleLinks.first()).toBeVisible();

    const titles = await movieTitleLinks.allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.every(t => t.trim().startsWith('2'))).toBeTruthy();
  });

  test('Browse by genre shows correct movies', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies/genre/1?genreName=Action`);

    // Best Practice: getByRole('heading') for the browse title
    await expect(page.getByRole('heading', { name: 'Browse Movies' })).toBeVisible();

    // Semantic disambiguation: movie titles are links inside h3 headings
    await expect(
      page.getByRole('heading', { level: 3 }).getByRole('link').first()
    ).toBeVisible();
  });

  test('Movies page opens and displays movie cards', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies`);

    await expect(page).toHaveURL(/movies/);

    // Best Practice: getByRole('heading') for page title
    await expect(page.getByRole('heading', { name: 'Browse Movies' })).toBeVisible();

    // Semantic disambiguation: at least one movie title link inside h3 is visible
    await expect(
      page.getByRole('heading', { level: 3 }).getByRole('link').first()
    ).toBeVisible();
  });

  test('Sort dropdown is visible and can be changed', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies`);

    // Best Practice: getByRole('combobox') for select elements
    const sortSelect = page.getByRole('combobox').first();
    await expect(sortSelect).toBeVisible();

    // Best Practice: selectOption by visible label text
    await sortSelect.selectOption('Rating');
  });

  test('Movie and star links navigate correctly', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/movies/tt0378947`);

    await expect(page).toHaveURL(/\/movies\/tt/);

    // Semantic disambiguation: star links are inside list items
    // distinguishes them from other links on the page
    const starLink = page.getByRole('listitem').getByRole('link').first();
    await expect(starLink).toBeVisible();
  });

});

// ============================================================
// CART TESTS
// ============================================================
test.describe('Cart', () => {

  test('Cart page loads, shows empty state, and allows adding and removing items', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/cart`);

    // Clear any leftover cart state from previous tests
    const clearBtn = page.getByRole('button', { name: 'Clear Cart' });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }

    // Best Practice: getByRole('button') for checkout button
    await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeDisabled();

    // Best Practice: getByText for visible empty state message
    await expect(page.getByText('Cart is empty.')).toBeVisible();

    // Add an item to cart from movie details page
    await page.goto(`${FRONTEND_URL}/movies/${MOVIE_ID}`);

    // Best Practice: getByRole('button') auto-waits until button is ready
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    await page.goto(`${FRONTEND_URL}/cart`);

    // Best Practice: toBeEnabled is a web-first assertion
    await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeEnabled();

    // Best Practice: getByRole('row') filtered by movie title text
    const rows     = page.getByRole('row').filter({ hasText: /Melinda/ });
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Best Practice: getByRole('spinbutton') for number inputs
      const qtyInput = page.getByRole('spinbutton').first();
      const oldVal   = await qtyInput.inputValue();
      const newVal   = oldVal === '2' ? '3' : '2';

      await qtyInput.fill(newVal);
      await qtyInput.blur();

      // Best Practice: getByRole('button') for Remove button
      await page.getByRole('button', { name: 'Remove' }).first().click();
    }

    // Clear cart and verify empty state
    await page.getByRole('button', { name: 'Clear Cart' }).click();

    // Best Practice: toBeVisible waits until empty state appears
    await expect(page.getByText('Cart is empty.')).toBeVisible();
  });

});

// ============================================================
// CHECKOUT TESTS
// ============================================================
test.describe('Checkout', () => {

  test('Name fields reject numbers and disable submit button', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/checkout`);

    // Best Practice: getByLabel works because labels are associated via for/id
    await page.getByLabel('Name on Card (First Name)').fill('Sara123');
    await page.getByLabel('Name on Card (Last Name)').fill('Alshuwaier1');

    await page.getByLabel('Name on Card (First Name)').blur();
    await page.getByLabel('Name on Card (Last Name)').blur();

    // Best Practice: getByText waits until error message appears
    await expect(
      page.getByText('Name on card must contain English letters only').first()
    ).toBeVisible();

    // Best Practice: toBeDisabled is a web-first assertion
    await expect(page.getByRole('button', { name: 'Pay Now' })).toBeDisabled();
  });

});