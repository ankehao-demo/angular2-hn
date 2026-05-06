import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './helpers';

test.beforeEach(async ({ page }) => {
  await setupMockRoutes(page);
});

test('feed page shows numbered list of stories', async ({ page }) => {
  await page.goto('/news/1');
  const items = page.locator('ol li');
  await expect(items.first()).toBeVisible();
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
});

test('pagination — More loads next page', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  const moreLink = page.locator('a:has-text("More")');
  await expect(moreLink).toBeVisible();
  await moreLink.click();
  await expect(page).toHaveURL(/\/news\/2/);
});

test('page 1 has no Prev link', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await expect(page.locator('a:has-text("Prev")')).not.toBeVisible();
});

test('page 2 has Prev link', async ({ page }) => {
  await page.goto('/news/2');
  await page.waitForSelector('ol li');
  await expect(page.locator('a:has-text("Prev")')).toBeVisible();
});

test('jobs feed shows Y Combinator header', async ({ page }) => {
  await page.goto('/jobs/1');
  await page.waitForSelector('ol li');
  await expect(page.locator('text=Y Combinator')).toBeVisible();
});
