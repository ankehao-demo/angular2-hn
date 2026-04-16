import { chromium, Browser, Page, BrowserContext, Route } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const API_BASE = 'https://node-hnapi.herokuapp.com';
const ANGULAR_URL = 'http://localhost:4200';
const REACT_URL = 'http://localhost:3000';
const ANGULAR_DIR = path.join(__dirname, 'screenshots', 'angular');
const REACT_DIR = path.join(__dirname, 'screenshots', 'react');
const MOCK_DIR = path.join(__dirname, 'mock-data');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 812 },
];

interface ScreenshotTask {
  prefix: string;
  routePath: string;
  apiPaths: string[];   // API paths to pre-fetch
  theme?: string;
  clickSettings?: boolean;
  waitExtra?: number;
}

// Cache for recorded API responses
const apiCache: Record<string, { status: number; body: string; headers: Record<string, string> }> = {};

/**
 * Phase 1: Record API responses by visiting the Angular app
 */
async function recordApiResponses(browser: Browser, tasks: ScreenshotTask[]) {
  console.log('\n=== Phase 1: Recording API responses ===');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  // Intercept all API calls and record them
  await page.route(`${API_BASE}/**`, async (route: Route) => {
    const url = route.request().url();
    const apiPath = url.replace(API_BASE, '');

    if (apiCache[apiPath]) {
      // Already recorded, serve from cache
      await route.fulfill({
        status: apiCache[apiPath].status,
        body: apiCache[apiPath].body,
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      });
      return;
    }

    // Fetch from real API and record
    try {
      const response = await route.fetch();
      const body = await response.text();
      apiCache[apiPath] = {
        status: response.status(),
        body,
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      };
      console.log(`  Recorded: ${apiPath} (${response.status()})`);
      await route.fulfill({
        status: response.status(),
        body,
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      });
    } catch (err) {
      console.error(`  Failed to record: ${apiPath}`);
      await route.continue();
    }
  });

  // Visit each unique route to trigger API calls
  const visitedPaths = new Set<string>();
  for (const task of tasks) {
    if (visitedPaths.has(task.routePath)) continue;
    visitedPaths.add(task.routePath);

    console.log(`  Visiting: ${task.routePath}`);
    try {
      await page.goto(`${ANGULAR_URL}${task.routePath}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await page.waitForTimeout(2000);
    } catch (err: any) {
      console.error(`  Error visiting ${task.routePath}: ${err.message}`);
    }
  }

  await ctx.close();

  // Save mock data for debugging
  fs.mkdirSync(MOCK_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(MOCK_DIR, 'api-cache.json'),
    JSON.stringify(apiCache, null, 2)
  );

  console.log(`  Recorded ${Object.keys(apiCache).length} API responses`);
}

/**
 * Set up route interception to serve cached API responses
 */
async function setupMockRoutes(page: Page) {
  await page.route(`${API_BASE}/**`, async (route: Route) => {
    const url = route.request().url();
    const apiPath = url.replace(API_BASE, '');

    if (apiCache[apiPath]) {
      await route.fulfill({
        status: apiCache[apiPath].status,
        body: apiCache[apiPath].body,
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      });
    } else {
      // Not in cache - for error-state this is expected
      console.log(`    Cache miss: ${apiPath}`);
      await route.continue();
    }
  });
}

/**
 * Navigate with optional theme
 */
async function navigateWithTheme(page: Page, url: string, theme?: string) {
  if (theme) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate((t) => { localStorage.setItem('theme', t); }, theme);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
  } else {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  }
  await page.waitForTimeout(2000);
}

/**
 * Phase 2: Capture screenshots with mocked API data
 */
async function captureWithMocks(browser: Browser, tasks: ScreenshotTask[]) {
  console.log('\n=== Phase 2: Capturing screenshots with mocked data ===');
  fs.mkdirSync(ANGULAR_DIR, { recursive: true });
  fs.mkdirSync(REACT_DIR, { recursive: true });

  for (const viewport of VIEWPORTS) {
    console.log(`\n--- ${viewport.name} (${viewport.width}x${viewport.height}) ---`);

    for (const task of tasks) {
      const filename = `${task.prefix}-${viewport.name}.png`;
      const angularFile = path.join(ANGULAR_DIR, filename);
      const reactFile = path.join(REACT_DIR, filename);
      console.log(`  Capturing: ${filename}`);

      // Fresh contexts per task
      const angularCtx = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const reactCtx = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const angularPage = await angularCtx.newPage();
      const reactPage = await reactCtx.newPage();

      // Set up mocks on both pages
      await setupMockRoutes(angularPage);
      await setupMockRoutes(reactPage);

      try {
        // Navigate both simultaneously
        await Promise.all([
          navigateWithTheme(angularPage, `${ANGULAR_URL}${task.routePath}`, task.theme),
          navigateWithTheme(reactPage, `${REACT_URL}${task.routePath}`, task.theme),
        ]);

        if (task.clickSettings) {
          await Promise.all([
            angularPage.click('img[src*="cog"]').catch(() => {}),
            reactPage.click('img[src*="cog"]').catch(() => {}),
          ]);
          await Promise.all([
            angularPage.waitForTimeout(500),
            reactPage.waitForTimeout(500),
          ]);
        }

        if (task.waitExtra) {
          await Promise.all([
            angularPage.waitForTimeout(task.waitExtra),
            reactPage.waitForTimeout(task.waitExtra),
          ]);
        }

        // Take screenshots simultaneously
        await Promise.all([
          angularPage.screenshot({ path: angularFile, fullPage: true, timeout: 60000 }),
          reactPage.screenshot({ path: reactFile, fullPage: true, timeout: 60000 }),
        ]);
        console.log(`    Saved: ${filename}`);
      } catch (err: any) {
        console.error(`    ERROR: ${err.message}`);
      } finally {
        await angularCtx.close();
        await reactCtx.close();
      }
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    // First, discover a story ID and user ID
    const tempCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const tempPage = await tempCtx.newPage();
    await tempPage.goto(`${ANGULAR_URL}/news/1`, { waitUntil: 'networkidle', timeout: 30000 });
    await tempPage.waitForTimeout(3000);

    // Pick a story with fewer comments to avoid screenshot timeouts
    // Look for stories with low comment counts
    const storyLinks = await tempPage.$$('a[href*="/item/"]');
    let storyId = '1';
    for (const link of storyLinks) {
      const text = await link.textContent();
      // Pick a story with "discuss" or low comment count
      if (text && (text.includes('discuss') || /^\d+ comment/.test(text.trim()))) {
        const href = await link.getAttribute('href');
        if (href) {
          const match = href.match(/\/item\/(\d+)/);
          if (match) {
            const count = parseInt(text.trim());
            if (text.includes('discuss') || (count > 0 && count <= 20)) {
              storyId = match[1];
              console.log(`Selected story ${storyId} with comments: ${text.trim()}`);
              break;
            }
          }
        }
      }
    }
    if (storyId === '1') {
      // Fallback: just pick first story link
      const firstLink = await tempPage.$('a[href*="/item/"]');
      const href = firstLink ? await firstLink.getAttribute('href') : '/item/1';
      storyId = href?.replace('/item/', '') || '1';
    }

    const userLink = await tempPage.$('a[href*="/user/"]');
    const userHref = userLink ? await userLink.getAttribute('href') : '/user/pg';
    const userId = userHref?.replace('/user/', '') || 'pg';

    console.log(`Using story ID: ${storyId}, user ID: ${userId}`);
    await tempCtx.close();

    const tasks: ScreenshotTask[] = [
      { prefix: 'feed-news-p1', routePath: '/news/1', apiPaths: ['/news?page=1'] },
      { prefix: 'feed-newest-p1', routePath: '/newest/1', apiPaths: ['/newest?page=1'] },
      { prefix: 'feed-show-p1', routePath: '/show/1', apiPaths: ['/show?page=1'] },
      { prefix: 'feed-ask-p1', routePath: '/ask/1', apiPaths: ['/ask?page=1'] },
      { prefix: 'feed-jobs-p1', routePath: '/jobs/1', apiPaths: ['/jobs?page=1'] },
      { prefix: 'feed-news-p2', routePath: '/news/2', apiPaths: ['/news?page=2'] },
      { prefix: 'item-detail', routePath: `/item/${storyId}`, apiPaths: [`/item/${storyId}`] },
      { prefix: 'user-profile', routePath: `/user/${userId}`, apiPaths: [`/user/${userId}`] },
      { prefix: 'settings-open', routePath: '/news/1', apiPaths: ['/news?page=1'], clickSettings: true },
      { prefix: 'feed-news-night', routePath: '/news/1', apiPaths: ['/news?page=1'], theme: 'night' },
      { prefix: 'item-detail-night', routePath: `/item/${storyId}`, apiPaths: [`/item/${storyId}`], theme: 'night' },
      { prefix: 'feed-news-black', routePath: '/news/1', apiPaths: ['/news?page=1'], theme: 'amoledblack' },
      { prefix: 'item-detail-black', routePath: `/item/${storyId}`, apiPaths: [`/item/${storyId}`], theme: 'amoledblack' },
      { prefix: 'error-state', routePath: '/item/99999999999', apiPaths: ['/item/99999999999'], waitExtra: 3000 },
    ];

    // Phase 1: Record API responses
    await recordApiResponses(browser, tasks);

    // Phase 2: Capture screenshots with mocked data
    await captureWithMocks(browser, tasks);

    console.log('\n=== All done! ===');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
