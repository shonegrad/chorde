import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Checks the production build for two mistakes that are easy to make and hard
 * to spot:
 *
 * - a missing 404.html, which makes every deep link return a 404 page
 * - a localhost API address baked into the bundle, which breaks the search
 *   for everyone who is not running the app on their own machine
 */

const distDir = resolve(process.cwd(), 'dist');
const problems = [];

const indexPath = join(distDir, 'index.html');
const fallbackPath = join(distDir, '404.html');

if (!existsSync(indexPath)) {
  problems.push('dist/index.html is missing - did the build run?');
} else {
  if (!existsSync(fallbackPath)) {
    problems.push(
      'dist/404.html is missing, so deep links such as /chorde/settings will return a 404 page.'
    );
  } else if (readFileSync(indexPath, 'utf8') !== readFileSync(fallbackPath, 'utf8')) {
    problems.push('dist/404.html does not match dist/index.html.');
  }
}

const collectFiles = (dir) => {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full));
    } else if (full.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
};

if (existsSync(join(distDir, 'assets'))) {
  for (const file of collectFiles(join(distDir, 'assets'))) {
    const contents = readFileSync(file, 'utf8');
    if (contents.includes('localhost:3001')) {
      problems.push(
        `${file} contains "localhost:3001". A production build must not point at a local API.`
      );
    }
  }
}

if (problems.length > 0) {
  console.error('Build verification failed:');
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log('Build verification passed.');
