import { describe, expect, it } from 'vitest';
import { SEED_SONGS } from '../../data/seedSongs';
import { JAZZ_PACK } from '../../data/jazzPack';
import { ROCK_PACK } from '../../data/rockPack';
import { ROCK_PACK_2 } from '../../data/rockPack2';
import { MIX_PACK } from '../../data/mixPack';
import { validateSongs } from '../songValidation';

describe('song validation', () => {
  it('validates seed songs', () => {
    const result = validateSongs(SEED_SONGS, 'seedSongs');
    expect(result.valid).toBe(true);
    if (result.errors.length > 0) {
      console.error(result.errors.join('\n'));
    }
  });

  it('validates jazz pack', () => {
    const result = validateSongs(JAZZ_PACK, 'jazzPack');
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
    const allSongs = [...SEED_SONGS, ...JAZZ_PACK, ...ROCK_PACK, ...ROCK_PACK_2, ...MIX_PACK];
    const ids = allSongs.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});
