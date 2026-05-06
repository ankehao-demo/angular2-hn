import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(__dirname, 'screenshots', 'source');
const REACT_DIR = path.join(__dirname, 'screenshots', 'react');
const DIFF_DIR = path.join(__dirname, 'screenshots', 'diff');

const THRESHOLD = 0.02; // 2% mismatch threshold

function loadPng(filePath) {
  const data = fs.readFileSync(filePath);
  return PNG.sync.read(data);
}

function compareImages(sourceFile, reactFile, diffFile) {
  const source = loadPng(sourceFile);
  const react = loadPng(reactFile);

  // Use the smaller dimensions to avoid size mismatch issues
  const width = Math.min(source.width, react.width);
  const height = Math.min(source.height, react.height);

  // Create canvases with the common size
  const sourceResized = new PNG({ width, height });
  const reactResized = new PNG({ width, height });

  // Copy pixels from source images
  PNG.bitblt(source, sourceResized, 0, 0, width, height, 0, 0);
  PNG.bitblt(react, reactResized, 0, 0, width, height, 0, 0);

  const diff = new PNG({ width, height });
  const numDiffPixels = pixelmatch(
    sourceResized.data,
    reactResized.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const mismatchPercent = (numDiffPixels / totalPixels) * 100;

  fs.writeFileSync(diffFile, PNG.sync.write(diff));

  return {
    mismatchPercent,
    numDiffPixels,
    totalPixels,
    sourceDimensions: `${source.width}x${source.height}`,
    reactDimensions: `${react.width}x${react.height}`,
    pass: mismatchPercent < THRESHOLD * 100,
  };
}

function main() {
  const sourceFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.png'));
  const results = [];
  let allPass = true;

  console.log('\n=== Visual Regression Test Results ===\n');
  console.log(`Threshold: <${THRESHOLD * 100}% pixel difference\n`);

  for (const file of sourceFiles) {
    const sourceFile = path.join(SOURCE_DIR, file);
    const reactFile = path.join(REACT_DIR, file);
    const diffFile = path.join(DIFF_DIR, file);

    if (!fs.existsSync(reactFile)) {
      console.log(`  MISSING: ${file} (no React screenshot)`);
      results.push({ file, status: 'MISSING', mismatchPercent: 100 });
      allPass = false;
      continue;
    }

    const result = compareImages(sourceFile, reactFile, diffFile);
    const status = result.pass ? 'PASS' : 'FAIL';
    if (!result.pass) allPass = false;

    console.log(
      `  ${status}: ${file} - ${result.mismatchPercent.toFixed(2)}% diff ` +
      `(${result.numDiffPixels}/${result.totalPixels} pixels) ` +
      `[source: ${result.sourceDimensions}, react: ${result.reactDimensions}]`
    );

    results.push({ file, status, ...result });
  }

  console.log(`\n=== Summary ===`);
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const missing = results.filter(r => r.status === 'MISSING').length;
  console.log(`Passed: ${passed}, Failed: ${failed}, Missing: ${missing}`);
  console.log(`Overall: ${allPass ? 'ALL PASS' : 'SOME FAILURES'}\n`);

  // Write results as JSON
  fs.writeFileSync(
    path.join(__dirname, 'results.json'),
    JSON.stringify({ threshold: THRESHOLD, results, allPass }, null, 2)
  );

  process.exit(allPass ? 0 : 1);
}

main();
