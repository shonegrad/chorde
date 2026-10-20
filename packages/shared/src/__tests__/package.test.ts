import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The shared package holds nothing but types, so the build output is an empty
 * module plus the declarations. These checks make sure the package is built
 * and that the declarations really contain the types the app relies on.
 */
describe('@chorde/shared', () => {
  const distDir = resolve(__dirname, '..', '..', 'dist');

  it('has been built', () => {
    expect(existsSync(resolve(distDir, 'index.d.ts'))).toBe(true);
    expect(existsSync(resolve(distDir, 'index.js'))).toBe(true);
  });

  it('declares the types the app depends on', () => {
    const declarations = readFileSync(resolve(distDir, 'index.d.ts'), 'utf8');

    for (const name of [
      'Song',
      'SongAttribution',
      'SongSection',
      'ParsedLine',
      'SearchResult',
      'SongContent',
      'SourceAdapter',
      'Source',
      'SongFilter',
      'LicenseType',
      'DisplayMode',
      'ViewMode',
    ]) {
      expect(declarations).toContain(name);
    }
  });

  it('keeps the licence type strict', () => {
    const declarations = readFileSync(resolve(distDir, 'index.d.ts'), 'utf8');
    expect(declarations).toContain('license?: LicenseType');
  });
});
