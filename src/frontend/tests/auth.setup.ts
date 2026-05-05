import { test as setup, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200';

setup('authenticate', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/login`);

  // Best Practice: getByLabel works 
  await page.getByLabel('Email').fill('Parker234@aol.com');
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Best Practice: wait for navigation away from login
  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 10000 });
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});