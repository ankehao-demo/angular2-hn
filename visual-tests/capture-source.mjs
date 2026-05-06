import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'source');
const BASE_URL = process.env.SOURCE_URL || 'http://localhost:4200';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

const VIEWS = [
  { name: 'news-page1', path: '/news/1' },
  { name: 'newest-page1', path: '/newest/1' },
  { name: 'show-page1', path: '/show/1' },
  { name: 'ask-page1', path: '/ask/1' },
  { name: 'jobs-page1', path: '/jobs/1' },
];

async function disableAnimations(page) {
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none !important; animation: none !important; }`,
  });
}

async function waitForReady(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

async function captureView(page, viewName, urlPath, viewport) {
  const viewportName = viewport.width === 1280 ? 'desktop' : 'mobile';
  await page.setViewportSize(viewport);
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForReady(page);
  await disableAnimations(page);
  await page.waitForTimeout(300);

  const filename = `${viewName}-${viewportName}.png`;
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: true });
  console.log(`  Captured: ${filename}`);
}

async function main() {
  console.log(`Capturing source app at ${BASE_URL}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const view of VIEWS) {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      await captureView(page, view.name, view.path, viewport);
    }
  }

  // Capture item detail - use a known item from news feed
  await page.setViewportSize(VIEWPORTS.desktop);
  await page.goto(`${BASE_URL}/news/1`, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForReady(page);

  // Get first item link to an item detail
  const firstItemLink = await page.locator('a[href*="/item/"]').first().getAttribute('href');
  if (firstItemLink) {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${firstItemLink}`, { waitUntil: 'networkidle', timeout: 30000 });
      await waitForReady(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);
      const filename = `item-detail-${name}.png`;
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  // Capture user profile
  const userLink = await page.locator('a[href*="/user/"]').first().getAttribute('href');
  if (userLink) {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${userLink}`, { waitUntil: 'networkidle', timeout: 30000 });
      await waitForReady(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);
      const filename = `user-profile-${name}.png`;
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  await browser.close();
  console.log('Source capture complete!');
}

main().catch(console.error);
