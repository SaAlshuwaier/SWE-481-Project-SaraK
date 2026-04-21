import { test as setup, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200';

setup('authenticate', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}/login`);
  await page.getByTestId('login-email').fill('cc@msn.com');
  await page.getByTestId('login-password').fill('1111');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toHaveCount(0);
  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 10000 });
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});