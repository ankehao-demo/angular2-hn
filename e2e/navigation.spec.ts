import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './helpers';

test.beforeEach(async ({ page }) => {
  await setupMockRoutes(page);
});

test('app loads and redirects / to /news/1', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/news\/1/);
});

test('clicking nav links navigates to correct feed pages', async ({ page }) => {
  await page.goto('/news/1');
  await page.click('a[href="/newest/1"]');
  await expect(page).toHaveURL(/\/newest\/1/);
  await page.click('a[href="/show/1"]');
  await expect(page).toHaveURL(/\/show\/1/);
  await page.click('a[href="/ask/1"]');
  await expect(page).toHaveURL(/\/ask\/1/);
  await page.click('a[href="/jobs/1"]');
  await expect(page).toHaveURL(/\/jobs\/1/);
});

test('clicking logo navigates to /news/1', async ({ page }) => {
  await page.goto('/newest/1');
  await page.click('header a[href="/news/1"]');
  await expect(page).toHaveURL(/\/news\/1/);
});

test('clicking comment link navigates to item details', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.locator('.subtext-laptop a[href*="/item/"]').first().click();
  await expect(page).toHaveURL(/\/item\//);
  await expect(page.locator('.item')).toBeVisible();
});

test('clicking username navigates to user profile', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.locator('.subtext-laptop a[href*="/user/"]').first().click();
  await expect(page).toHaveURL(/\/user\//);
});

test('browser back from item details navigates back', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.locator('.subtext-laptop a[href*="/item/"]').first().click();
  await expect(page).toHaveURL(/\/item\//);
  await page.goBack();
  await expect(page).toHaveURL(/\/news\/1/);
});
