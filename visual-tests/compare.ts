import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const ANGULAR_DIR = path.join(__dirname, 'screenshots', 'angular');
const REACT_DIR = path.join(__dirname, 'screenshots', 'react');
const DIFF_DIR = path.join(__dirname, 'screenshots', 'diffs');
const THRESHOLD = 0.02; // 2% mismatch threshold

interface CompareResult {
  name: string;
  mismatchPixels: number;
  totalPixels: number;
  mismatchPercent: number;
  status: 'PASS' | 'FAIL' | 'SKIP';
  reason?: string;
}

function loadPNG(filepath: string): PNG {
  const buffer = fs.readFileSync(filepath);
  return PNG.sync.read(buffer);
}

function compareImages(angularPath: string, reactPath: string, diffPath: string): CompareResult {
  const name = path.basename(angularPath);

  if (!fs.existsSync(angularPath)) {
    return { name, mismatchPixels: 0, totalPixels: 0, mismatchPercent: 0, status: 'SKIP', reason: 'Angular screenshot missing' };
  }
  if (!fs.existsSync(reactPath)) {
    return { name, mismatchPixels: 0, totalPixels: 0, mismatchPercent: 0, status: 'SKIP', reason: 'React screenshot missing' };
  }

  const angular = loadPNG(angularPath);
  const react = loadPNG(reactPath);

  // Handle size differences - use the larger dimensions
  const width = Math.max(angular.width, react.width);
  const height = Math.max(angular.height, react.height);

  // If sizes differ, create resized buffers
  let angularData = angular.data;
  let reactData = react.data;

  if (angular.width !== width || angular.height !== height) {
    const newBuf = Buffer.alloc(width * height * 4, 0);
    for (let y = 0; y < angular.height; y++) {
      for (let x = 0; x < angular.width; x++) {
        const srcIdx = (y * angular.width + x) * 4;
        const dstIdx = (y * width + x) * 4;
        newBuf[dstIdx] = angular.data[srcIdx];
        newBuf[dstIdx + 1] = angular.data[srcIdx + 1];
        newBuf[dstIdx + 2] = angular.data[srcIdx + 2];
        newBuf[dstIdx + 3] = angular.data[srcIdx + 3];
      }
    }
    angularData = newBuf;
  }

  if (react.width !== width || react.height !== height) {
    const newBuf = Buffer.alloc(width * height * 4, 0);
    for (let y = 0; y < react.height; y++) {
      for (let x = 0; x < react.width; x++) {
        const srcIdx = (y * react.width + x) * 4;
        const dstIdx = (y * width + x) * 4;
        newBuf[dstIdx] = react.data[srcIdx];
        newBuf[dstIdx + 1] = react.data[srcIdx + 1];
        newBuf[dstIdx + 2] = react.data[srcIdx + 2];
        newBuf[dstIdx + 3] = react.data[srcIdx + 3];
      }
    }
    reactData = newBuf;
  }

  const diff = new PNG({ width, height });
  const totalPixels = width * height;

  const mismatchPixels = pixelmatch(
    angularData as any,
    reactData as any,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  // Save diff image
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const mismatchPercent = (mismatchPixels / totalPixels) * 100;
  const status = mismatchPercent > (THRESHOLD * 100) ? 'FAIL' : 'PASS';

  return { name, mismatchPixels, totalPixels, mismatchPercent, status };
}

async function main() {
  fs.mkdirSync(DIFF_DIR, { recursive: true });

  // Find all Angular screenshots
  if (!fs.existsSync(ANGULAR_DIR)) {
    console.error('Angular screenshots directory not found. Run capture-angular.ts first.');
    process.exit(1);
  }

  const angularFiles = fs.readdirSync(ANGULAR_DIR).filter(f => f.endsWith('.png')).sort();
  console.log(`Found ${angularFiles.length} Angular screenshots\n`);

  const results: CompareResult[] = [];

  for (const file of angularFiles) {
    const angularPath = path.join(ANGULAR_DIR, file);
    const reactPath = path.join(REACT_DIR, file);
    const diffPath = path.join(DIFF_DIR, file.replace('.png', '-diff.png'));

    const result = compareImages(angularPath, reactPath, diffPath);
    results.push(result);
  }

  // Print summary table
  console.log('=' .repeat(90));
  console.log('VISUAL REGRESSION TEST RESULTS');
  console.log('=' .repeat(90));
  console.log(
    'Screenshot'.padEnd(45) +
    'Mismatch %'.padEnd(15) +
    'Pixels'.padEnd(15) +
    'Status'
  );
  console.log('-'.repeat(90));

  let passCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const result of results) {
    const statusIcon = result.status === 'PASS' ? 'PASS' : result.status === 'FAIL' ? 'FAIL' : 'SKIP';
    const reason = result.reason ? ` (${result.reason})` : '';
    console.log(
      result.name.padEnd(45) +
      `${result.mismatchPercent.toFixed(2)}%`.padEnd(15) +
      `${result.mismatchPixels}/${result.totalPixels}`.padEnd(15) +
      `${statusIcon}${reason}`
    );

    if (result.status === 'PASS') passCount++;
    else if (result.status === 'FAIL') failCount++;
    else skipCount++;
  }

  console.log('-'.repeat(90));
  console.log(`\nSummary: ${passCount} PASS, ${failCount} FAIL, ${skipCount} SKIP out of ${results.length} total`);
  console.log(`Threshold: ${THRESHOLD * 100}% pixel mismatch`);

  if (failCount > 0) {
    console.log('\nFAILED screenshots (check diffs/ directory):');
    for (const result of results.filter(r => r.status === 'FAIL')) {
      console.log(`  - ${result.name}: ${result.mismatchPercent.toFixed(2)}% mismatch`);
    }
    process.exit(1);
  } else {
    console.log('\nAll screenshots within threshold!');
  }
}

main().catch(console.error);
