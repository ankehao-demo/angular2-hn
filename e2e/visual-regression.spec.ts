import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './helpers';

test.beforeEach(async ({ page }) => {
  await setupMockRoutes(page);
});

test('news feed visual snapshot', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await expect(page).toHaveScreenshot('news-feed.png', { fullPage: true });
});

test('item details with comments visual snapshot', async ({ page }) => {
  await page.goto('/item/1001');
  await page.waitForSelector('.item');
  await expect(page).toHaveScreenshot('item-details.png', { fullPage: true });
});

test('user profile visual snapshot', async ({ page }) => {
  await page.goto('/user/testuser');
  await page.waitForSelector('.profile');
  await expect(page).toHaveScreenshot('user-profile.png', { fullPage: true });
});

test('settings panel open visual snapshot', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.click('img.settings');
  await page.waitForSelector('.overlay .popup');
  await expect(page).toHaveScreenshot('settings-open.png', { fullPage: true });
});

test('night theme visual snapshot', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.click('img.settings');
  await page.locator('label:has-text("Night") input').click();
  await expect(page).toHaveScreenshot('night-theme.png', { fullPage: true });
});

test('jobs feed visual snapshot', async ({ page }) => {
  await page.goto('/jobs/1');
  await page.waitForSelector('ol li');
  await expect(page).toHaveScreenshot('jobs-feed.png', { fullPage: true });
});
