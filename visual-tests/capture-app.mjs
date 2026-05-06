import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

async function captureView(page, baseUrl, screenshotsDir, viewName, urlPath, viewport) {
  const viewportName = viewport.width === 1280 ? 'desktop' : 'mobile';
  await page.setViewportSize(viewport);
  await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForReady(page);
  await disableAnimations(page);
  await page.waitForTimeout(300);

  const filename = `${viewName}-${viewportName}.png`;
  await page.screenshot({ path: path.join(screenshotsDir, filename), fullPage: true });
  console.log(`  Captured: ${filename}`);
}

export async function captureApp(baseUrl, outputDir, label) {
  const screenshotsDir = path.join(__dirname, 'screenshots', outputDir);
  console.log(`Capturing ${label} at ${baseUrl}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const view of VIEWS) {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await captureView(page, baseUrl, screenshotsDir, view.name, view.path, viewport);
    }
  }

  await page.setViewportSize(VIEWPORTS.desktop);
  await page.goto(`${baseUrl}/news/1`, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForReady(page);

  const firstItemLink = await page.locator('a[href*="/item/"]').first().getAttribute('href');
  if (firstItemLink) {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseUrl}${firstItemLink}`, { waitUntil: 'networkidle', timeout: 30000 });
      await waitForReady(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);
      const filename = `item-detail-${name}.png`;
      await page.screenshot({ path: path.join(screenshotsDir, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  const userLink = await page.locator('a[href*="/user/"]').first().getAttribute('href');
  if (userLink) {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseUrl}${userLink}`, { waitUntil: 'networkidle', timeout: 30000 });
      await waitForReady(page);
      await disableAnimations(page);
      await page.waitForTimeout(500);
      const filename = `user-profile-${name}.png`;
      await page.screenshot({ path: path.join(screenshotsDir, filename), fullPage: true });
      console.log(`  Captured: ${filename}`);
    }
  }

  await browser.close();
  console.log(`${label} capture complete!`);
}
