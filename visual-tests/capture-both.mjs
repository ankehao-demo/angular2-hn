import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(__dirname, 'screenshots', 'source');
const REACT_DIR = path.join(__dirname, 'screenshots', 'react');
const SOURCE_URL = process.env.SOURCE_URL || 'http://localhost:4200';
const REACT_URL = process.env.REACT_URL || 'http://localhost:5173';
const API_BASE = 'https://node-hnapi.herokuapp.com';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

const FEED_VIEWS = [
  { name: 'news-page1', path: '/news/1', apiPath: '/news?page=1' },
  { name: 'newest-page1', path: '/newest/1', apiPath: '/newest?page=1' },
  { name: 'show-page1', path: '/show/1', apiPath: '/show?page=1' },
  { name: 'ask-page1', path: '/ask/1', apiPath: '/ask?page=1' },
  { name: 'jobs-page1', path: '/jobs/1', apiPath: '/jobs?page=1' },
];

const apiCache = {};

async function cacheApiResponse(url) {
  if (apiCache[url]) return apiCache[url];
  try {
    const res = await fetch(url);
    const text = await res.text();
    const data = JSON.parse(text);
    apiCache[url] = data;
    return data;
  } catch (e) {
    console.log(`  Warning: Could not cache ${url}: ${e.message}`);
    return null;
  }
}

async function setupRouteInterception(page) {
  await page.route(`${API_BASE}/**`, async (route) => {
    const url = route.request().url();
    try {
      if (apiCache[url]) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(apiCache[url]),
        });
      } else {
        const response = await fetch(url);
        const data = await response.json();
        apiCache[url] = data;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(data),
        });
      }
    } catch (e) {
      await route.continue();
    }
  });
}

async function disableAnimations(page) {
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none !important; animation: none !important; }`,
  });
}

async function waitForContent(page) {
  await page.waitForLoadState('domcontentloaded');
  // Wait for content to render - either list items or specific content
  try {
    await page.waitForSelector('.item-block, .item, .profile, .job-header, .loading-section', { timeout: 15000 });
  } catch (e) {
    // fallback - just wait
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);
}

async function captureApp(browser, baseUrl, outputDir, label) {
  console.log(`\nCapturing ${label} at ${baseUrl}`);
  const context = await browser.newContext();
  const page = await context.newPage();
  await setupRouteInterception(page);

  // Pre-cache all feed data
  console.log('  Pre-caching API data...');
  for (const view of FEED_VIEWS) {
    await cacheApiResponse(`${API_BASE}${view.apiPath}`);
  }

  // Capture feed views
  for (const view of FEED_VIEWS) {
    for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseUrl}${view.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForContent(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);

      const filename = `${view.name}-${vpName}.png`;
      await page.screenshot({ path: path.join(outputDir, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  // Get item and user links from the news feed
  await page.setViewportSize(VIEWPORTS.desktop);
  await page.goto(`${baseUrl}/news/1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForContent(page);

  const itemLink = await page.locator('a[href*="/item/"]').first().getAttribute('href');
  const userLink = await page.locator('a[href*="/user/"]').first().getAttribute('href');

  // Capture item detail
  if (itemLink) {
    const itemId = itemLink.split('/').pop();
    await cacheApiResponse(`${API_BASE}/item/${itemId}`);

    for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseUrl}${itemLink}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForContent(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);
      const filename = `item-detail-${vpName}.png`;
      await page.screenshot({ path: path.join(outputDir, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  // Capture user profile
  if (userLink) {
    const userId = userLink.split('/').pop();
    await cacheApiResponse(`${API_BASE}/user/${userId}`);

    for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseUrl}${userLink}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForContent(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);
      const filename = `user-profile-${vpName}.png`;
      await page.screenshot({ path: path.join(outputDir, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  await captureApp(browser, SOURCE_URL, SOURCE_DIR, 'Source (Angular)');
  await captureApp(browser, REACT_URL, REACT_DIR, 'React');

  await browser.close();
  console.log('\nBoth apps captured with identical API data!');
}

main().catch(console.error);
