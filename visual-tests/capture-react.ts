import { chromium, Browser, Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'react');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 812 },
];

interface ScreenshotTask {
  prefix: string;
  url?: string;
  setup?: (page: Page) => Promise<void>;
}

async function captureScreenshots() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const browser: Browser = await chromium.launch({ headless: true });

  try {
    // Get a story ID and user ID from the news feed
    const tempPage = await browser.newPage();
    await tempPage.goto(`${BASE_URL}/news/1`, { waitUntil: 'networkidle' });
    await tempPage.waitForTimeout(3000);

    const storyLink = await tempPage.$('a[href*="/item/"]');
    const storyHref = storyLink ? await storyLink.getAttribute('href') : '/item/1';
    const storyId = storyHref?.replace('/item/', '') || '1';

    const userLink = await tempPage.$('a[href*="/user/"]');
    const userHref = userLink ? await userLink.getAttribute('href') : '/user/pg';
    const userId = userHref?.replace('/user/', '') || 'pg';

    console.log(`Using story ID: ${storyId}, user ID: ${userId}`);
    await tempPage.close();

    const tasks: ScreenshotTask[] = [
      { prefix: 'feed-news-p1', url: `${BASE_URL}/news/1` },
      { prefix: 'feed-newest-p1', url: `${BASE_URL}/newest/1` },
      { prefix: 'feed-show-p1', url: `${BASE_URL}/show/1` },
      { prefix: 'feed-ask-p1', url: `${BASE_URL}/ask/1` },
      { prefix: 'feed-jobs-p1', url: `${BASE_URL}/jobs/1` },
      { prefix: 'feed-news-p2', url: `${BASE_URL}/news/2` },
      { prefix: 'item-detail', url: `${BASE_URL}/item/${storyId}` },
      { prefix: 'user-profile', url: `${BASE_URL}/user/${userId}` },
      {
        prefix: 'settings-open',
        url: `${BASE_URL}/news/1`,
        setup: async (page: Page) => {
          await page.click('img[src*="cog"]');
          await page.waitForTimeout(500);
        },
      },
      {
        prefix: 'feed-news-night',
        url: `${BASE_URL}/news/1`,
        setup: async (page: Page) => {
          await page.evaluate(() => { localStorage.setItem('theme', 'night'); });
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);
        },
      },
      {
        prefix: 'item-detail-night',
        url: `${BASE_URL}/item/${storyId}`,
      },
      {
        prefix: 'feed-news-black',
        url: `${BASE_URL}/news/1`,
        setup: async (page: Page) => {
          await page.evaluate(() => { localStorage.setItem('theme', 'black'); });
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);
        },
      },
      {
        prefix: 'item-detail-black',
        url: `${BASE_URL}/item/${storyId}`,
      },
      {
        prefix: 'error-state',
        url: `${BASE_URL}/item/99999999999`,
        setup: async (page: Page) => {
          await page.evaluate(() => { localStorage.setItem('theme', 'default'); });
          await page.waitForTimeout(3000);
        },
      },
    ];

    for (const viewport of VIEWPORTS) {
      console.log(`\n=== Capturing ${viewport.name} (${viewport.width}x${viewport.height}) ===`);
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      for (const task of tasks) {
        const filename = `${task.prefix}-${viewport.name}.png`;
        const filepath = path.join(SCREENSHOT_DIR, filename);
        console.log(`Capturing: ${filename}`);

        if (task.url) {
          await page.goto(task.url, { waitUntil: 'networkidle' });
          await page.waitForTimeout(2000);
        }
        if (task.setup) {
          await task.setup(page);
        }
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`  Saved: ${filepath}`);
      }

      await page.evaluate(() => { localStorage.clear(); });
      await context.close();
    }

    console.log('\n=== All React screenshots captured! ===');
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
