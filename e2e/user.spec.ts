import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './helpers';

test.beforeEach(async ({ page }) => {
  await setupMockRoutes(page);
});

test('shows username, karma, created date', async ({ page }) => {
  await page.goto('/user/testuser');
  await expect(page.locator('.main-details .name')).toBeVisible();
  await expect(page.locator('.main-details .name')).toHaveText('testuser');
  await expect(page.locator('text=5000')).toBeVisible();
  await expect(page.locator('text=2 years ago')).toBeVisible();
});

test('about section renders when present', async ({ page }) => {
  await page.goto('/user/testuser');
  await expect(page.locator('.other-details')).toBeVisible();
  await expect(page.locator('text=A test user on Hacker News')).toBeVisible();
});
