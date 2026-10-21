import { describe, it, expect } from 'vitest';
import { groupSongs, sortSongs, transposeSong } from '../library';
import type { Song } from '../../types';

const song = (overrides: Partial<Song> & { id: string }): Song => ({
  title: overrides.id,
  artist: 'Someone',
  content: '[C]Words',
  attribution: {
    sourceName: 'test',
    sourceUrl: '',
    license: 'public-domain',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const library: Song[] = [
  song({ id: 'b', title: 'Beta', artist: 'Second', key: 'G', duration: '3:00', bpm: 90 }),
  song({ id: 'a', title: 'Alpha', artist: 'First', key: 'C', duration: '4:00', bpm: 120 }),
  song({ id: 'c', title: 'Gamma', artist: 'Second', key: 'C', duration: '2:00', capo: 3 }),
];

describe('sorting the library', () => {
  it('sorts by title', () => {
    expect(sortSongs(library, 'title').map((s) => s.title)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('sorts by artist', () => {
    expect(sortSongs(library, 'artist').map((s) => s.artist)).toEqual([
      'First',
      'Second',
      'Second',
    ]);
  });

  it('sorts by length, and the songs with no length go last', () => {
    const withLength = [...library, song({ id: 'd', title: 'Delta' })];
    expect(sortSongs(withLength, 'length').map((s) => s.title)).toEqual([
      'Gamma',
      'Beta',
      'Alpha',
      'Delta',
    ]);
  });

  it('sorts by tempo, and the songs with no tempo go last', () => {
    const withTempo = [...library, song({ id: 'd', title: 'Delta' })];
    expect(sortSongs(withTempo, 'tempo').map((s) => s.title)).toEqual([
      'Beta',
      'Alpha',
      'Delta',
      'Gamma',
    ]);
  });

  it('sorts by capo', () => {
    const withCapo = [...library, song({ id: 'd', title: 'Delta', capo: 1 })];
    expect(sortSongs(withCapo, 'capo').map((s) => s.title)).toEqual([
      'Alpha',
      'Beta',
      'Delta',
      'Gamma',
    ]);
  });

  it('puts the favourites first', () => {
    const withFavourite = [...library, song({ id: 'd', title: 'Delta', favorite: true })];
    expect(sortSongs(withFavourite, 'favourite')[0].title).toBe('Delta');
  });
});

describe('grouping the library', () => {
  it('puts the songs in one group when there are no groups', () => {
    const groups = groupSongs(library, 'none');

    expect(groups).toHaveLength(1);
    expect(groups[0].songs).toHaveLength(3);
  });

  it('groups by artist', () => {
    const groups = groupSongs(library, 'artist');

    expect(groups.map((group) => group.label)).toEqual(['First', 'Second']);
    expect(groups[1].songs).toHaveLength(2);
  });

  it('groups by key, and the songs with no key are together', () => {
    const groups = groupSongs([...library, song({ id: 'd', title: 'Delta' })], 'key');

    expect(groups.map((group) => group.label)).toEqual(['C', 'G', 'No key']);
  });

  it('puts a song in a group for each of its tags', () => {
    const groups = groupSongs([song({ id: 'a', tags: ['folk', 'sacred'] })], 'tag');

    expect(groups.map((group) => group.label)).toEqual(['folk', 'sacred']);
  });
});

describe('transposing a song for good', () => {
  it('moves the chords and the key', () => {
    const transposed = transposeSong(
      song({ id: 'a', key: 'C', content: '{title: Test}\n{key: C}\n[C]Words [G]more' }),
      2
    );

    expect(transposed.key).toBe('D');
    expect(transposed.content).toContain('[D]Words');
    expect(transposed.content).toContain('{key: D}');
  });

  it('leaves a song alone when there is nothing to do', () => {
    const original = song({ id: 'a', key: 'C' });

    expect(transposeSong(original, 0)).toBe(original);
  });

  it('keeps the chords spelled the way the key is written', () => {
    // F is a flat key, so the song is moved to G flat rather than F sharp.
    const transposed = transposeSong(
      song({ id: 'a', key: 'F', content: '{key: F}\n[Bb]Words' }),
      1
    );

    expect(transposed.key).toBe('Gb');
    expect(transposed.content).toContain('[B]Words');
  });
});
