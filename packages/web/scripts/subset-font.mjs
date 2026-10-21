/**
 * Makes the music font the notation uses.
 *
 * VexFlow draws the notes with the Bravura font, which is a quarter of a
 * megabyte. The app only needs a couple of dozen glyphs out of it, so the
 * font is cut down to those and kept in the app, where it works offline.
 *
 * Run it with: node scripts/subset-font.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(here, '../public/fonts/Bravura-notation.woff2');

/**
 * The glyphs a chord needs: the clef, the note heads, the accidentals, the
 * dot, the flags, the time signature and the rests.
 */
const GLYPHS = [
  0xe050, // the treble clef
  0xe0a2,
  0xe0a3,
  0xe0a4, // the note heads: whole, half, black
  0xe260,
  0xe261,
  0xe262,
  0xe263,
  0xe264, // the accidentals
  0xe1e7, // the augmentation dot
  0xe240,
  0xe241,
  0xe242,
  0xe243, // the flags
  ...Array.from({ length: 10 }, (_, index) => 0xe080 + index), // the time signature
  0xe4e3,
  0xe4e4,
  0xe4e5, // the rests
];

/** The font, from the copy VexFlow carries. */
const vexflowFont = resolve(here, '../../../node_modules/vexflow/build/esm/src/fonts/bravura.js');
const source = readFileSync(vexflowFont, 'utf8');
const match = source.match(/base64,([A-Za-z0-9+/=]+)/);
if (!match) {
  throw new Error(`Could not find the font in ${vexflowFont}`);
}

const font = Buffer.from(match[1], 'base64');
const subset = await subsetFont(font, String.fromCodePoint(...GLYPHS), { targetFormat: 'woff2' });

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, subset);

console.log(`Wrote ${output} (${subset.length} bytes)`);
