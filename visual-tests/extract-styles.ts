import { chromium } from 'playwright';

async function extractStyles(url: string, label: string) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const styles = await page.evaluate(() => {
    const results: Record<string, any> = {};
    
    const getProps = (el: Element) => {
      const s = window.getComputedStyle(el);
      return {
        fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily,
        lineHeight: s.lineHeight, color: s.color, display: s.display,
        margin: s.margin, padding: s.padding, textDecoration: s.textDecoration,
        backgroundColor: s.backgroundColor, height: s.height, width: s.width,
        borderBottom: s.borderBottom, position: s.position, letterSpacing: s.letterSpacing,
        listStyleType: s.listStyleType, boxSizing: s.boxSizing,
      };
    };

    // Header
    const header = document.querySelector('header');
    if (header) results.header = getProps(header);

    // OL
    const ol = document.querySelector('ol');
    if (ol) results.ol = getProps(ol);

    // First LI
    const li = document.querySelector('ol > li');
    if (li) results.li = getProps(li);

    // First child of LI (the item wrapper)
    const liChild = li?.firstElementChild;
    if (liChild) {
      results.liChild = { tagName: liChild.tagName, className: liChild.className, ...getProps(liChild) };
    }

    // Title link
    const titleLink = document.querySelector('.title');
    if (titleLink) results.titleLink = getProps(titleLink);

    // First p inside li
    const firstP = document.querySelector('ol > li p');
    if (firstP) results.firstP = getProps(firstP);

    // Subtext-laptop
    const subtextLaptop = document.querySelector('.subtext-laptop');
    if (subtextLaptop) results.subtextLaptop = getProps(subtextLaptop);

    // Subtext-laptop a
    const subtextLaptopA = document.querySelector('.subtext-laptop a');
    if (subtextLaptopA) results.subtextLaptopA = getProps(subtextLaptopA);

    // Domain span
    const domain = document.querySelector('.domain');
    if (domain) results.domain = getProps(domain);

    // Main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) results.mainContent = getProps(mainContent);

    // Nav
    const nav = document.querySelector('.nav');
    if (nav) results.nav = getProps(nav);

    // Nav a
    const navA = document.querySelector('.nav a');
    if (navA) results.navA = getProps(navA);

    // Body
    results.body = getProps(document.body);

    // Li heights for first 5 items
    const lis = document.querySelectorAll('ol > li');
    results.liHeights = [];
    for (let i = 0; i < Math.min(5, lis.length); i++) {
      const rect = lis[i].getBoundingClientRect();
      (results.liHeights as any[]).push({ index: i, height: rect.height, top: rect.top, bottom: rect.bottom });
    }

    // Full page height
    results.pageHeight = document.documentElement.scrollHeight;

    return results;
  });

  console.log(`\n===== ${label} =====`);
  for (const [key, val] of Object.entries(styles)) {
    console.log(`\n[${key}]`);
    if (Array.isArray(val)) {
      val.forEach((v: any) => console.log(`  ${JSON.stringify(v)}`));
    } else if (typeof val === 'object') {
      for (const [k, v] of Object.entries(val as Record<string, any>)) {
        console.log(`  ${k}: ${v}`);
      }
    } else {
      console.log(`  ${val}`);
    }
  }
  
  await browser.close();
  return styles;
}

async function main() {
  const angular = await extractStyles('http://localhost:4200/news/1', 'ANGULAR');
  const react = await extractStyles('http://localhost:3000/news/1', 'REACT');
  
  // Print differences
  console.log('\n\n===== DIFFERENCES =====');
  for (const key of Object.keys(angular)) {
    if (key === 'liHeights' || key === 'pageHeight') continue;
    const a = angular[key] as Record<string, any>;
    const r = react[key] as Record<string, any>;
    if (!r) {
      console.log(`\n[${key}] MISSING in React`);
      continue;
    }
    const diffs: string[] = [];
    for (const prop of Object.keys(a)) {
      if (a[prop] !== r[prop]) {
        diffs.push(`  ${prop}: Angular="${a[prop]}" React="${r[prop]}"`);
      }
    }
    if (diffs.length > 0) {
      console.log(`\n[${key}]`);
      diffs.forEach(d => console.log(d));
    }
  }

  // Compare li heights
  console.log('\n\n===== LI HEIGHT COMPARISON =====');
  const aHeights = angular.liHeights as any[];
  const rHeights = react.liHeights as any[];
  for (let i = 0; i < Math.min(aHeights.length, rHeights.length); i++) {
    const diff = rHeights[i].height - aHeights[i].height;
    console.log(`  Item ${i}: Angular=${aHeights[i].height.toFixed(1)}px React=${rHeights[i].height.toFixed(1)}px diff=${diff.toFixed(1)}px`);
  }
  console.log(`  Page height: Angular=${angular.pageHeight} React=${react.pageHeight}`);
}

main().catch(console.error);
