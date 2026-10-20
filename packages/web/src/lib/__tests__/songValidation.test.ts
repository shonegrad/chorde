import { describe, expect, it } from 'vitest';
import { SEED_SONGS } from '../../data/seedSongs';
import { ROCK_PACK } from '../../data/rockPack';
import { ROCK_PACK_2 } from '../../data/rockPack2';
import { MIX_PACK } from '../../data/mixPack';
import { validateSongs } from '../songValidation';

const ALL_PACKS = [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2, ...MIX_PACK];

/**
 * Songs that have been checked and confirmed to be in the public domain.
 *
 * A licence field on a song is only a claim. This list is the review: adding
 * a song means deciding here that it is out of copyright, and the test fails
 * until that decision is made. Remember that it is the *song* that must be
 * out of copyright, not just the recording.
 */
const APPROVED_PUBLIC_DOMAIN = [
  'Amazing Grace',
  'Bury Me Beneath the Willow',
  'Cripple Creek',
  'Down in the Valley',
  'Greensleeves',
  'House of the Rising Sun',
  "I Ain't Got Nobody",
  'I Am a Man of Constant Sorrow',
  'Kumbaya',
  'Oh My Darling Clementine',
  'Oh Susanna',
  'Shady Grove',
  'This Little Light of Mine',
  'When the Saints Go Marching In',
  'Wildwood Flower',
  'Will the Circle Be Unbroken',
];

describe('song validation', () => {
  it('validates seed songs', () => {
    const result = validateSongs(SEED_SONGS, 'seedSongs');
    expect(result.valid).toBe(true);
    if (result.errors.length > 0) {
      console.error(result.errors.join('\n'));
    }
  });

  it('validates rock pack', () => {
    const result = validateSongs(ROCK_PACK, 'rockPack');
    expect(result.valid).toBe(true);
    if (result.errors.length > 0) {
      console.error(result.errors.join('\n'));
    }
  });

  it('validates rock pack 2', () => {
    const result = validateSongs(ROCK_PACK_2, 'rockPack2');
    expect(result.valid).toBe(true);
    if (result.errors.length > 0) {
      console.error(result.errors.join('\n'));
    }
  });

  it('validates mix pack', () => {
    const result = validateSongs(MIX_PACK, 'mixPack');
    expect(result.valid).toBe(true);
    if (result.errors.length > 0) {
      console.error(result.errors.join('\n'));
    }
  });

  it('checks for duplicate song ids across all packs', () => {
    const ids = ALL_PACKS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('only ships songs that are in the public domain', () => {
    const offending = ALL_PACKS.filter(
      (song) => song.attribution.license !== 'public-domain' || song.rightsStatus !== 'open'
    );

    expect(offending.map((song) => `${song.title} (${song.attribution.license})`)).toEqual([]);
  });

  it('only ships songs that have been checked for the public domain', () => {
    const approved = new Set(APPROVED_PUBLIC_DOMAIN);
    const unchecked = ALL_PACKS.filter((song) => !approved.has(song.title)).map(
      (song) => song.title
    );

    expect(unchecked).toEqual([]);
  });

  it('gives every seeded song a writer', () => {
    const missing = ALL_PACKS.filter((song) => !song.artist || song.artist === 'Unknown Artist');
    expect(missing.map((song) => song.title)).toEqual([]);
  });
});
