import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './helpers';

test.beforeEach(async ({ page }) => {
  await setupMockRoutes(page);
});

test('shows title, points, user, time, comments', async ({ page }) => {
  await page.goto('/item/1001');
  await expect(page.locator('.laptop .title').first()).toBeVisible();
  await expect(page.locator('.laptop >> text=250 points')).toBeVisible();
  await expect(page.locator('.laptop a:has-text("testuser")')).toBeVisible();
  await expect(page.locator('.laptop >> text=5 hours ago')).toBeVisible();
});

test('comments collapse/expand', async ({ page }) => {
  await page.goto('/item/1001');
  await expect(page.locator('text=This is a test comment')).toBeVisible();
  await page.locator('.collapse').first().click();
  await expect(page.locator('text=[+]').first()).toBeVisible();
});

test('deleted comments display correctly', async ({ page }) => {
  await page.goto('/item/1001');
  await expect(page.locator('text=Comment Deleted').first()).toBeVisible();
});
