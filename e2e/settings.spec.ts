import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './helpers';

test.beforeEach(async ({ page }) => {
  await setupMockRoutes(page);
});

test('cog icon opens settings panel', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.click('img.settings');
  await expect(page.locator('.overlay .popup')).toBeVisible();
});

test('changing theme applies theme class', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.click('img.settings');
  await page.locator('label:has-text("Night") input').click();
  const wrapper = page.locator('.night').first();
  await expect(wrapper).toBeVisible();
});

test('settings persist across page reload', async ({ page }) => {
  await page.goto('/news/1');
  await page.waitForSelector('ol li');
  await page.click('img.settings');
  await page.locator('label:has-text("Night") input').click();
  await page.reload();
  await page.waitForSelector('ol li');
  const wrapper = page.locator('.night').first();
  await expect(wrapper).toBeVisible();
});
