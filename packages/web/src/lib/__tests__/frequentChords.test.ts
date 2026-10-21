import { describe, it, expect } from 'vitest';
import { chordsByUse, frequentChordNames } from '../frequentChords';
import type { Song } from '../../types';

const song = (overrides: Partial<Song> & { id: string }): Song => ({
  title: overrides.id,
  artist: 'Someone',
  content: '[C]Words [G]more',
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

describe('the chords a player reaches for most', () => {
  it('counts the songs that have been played', () => {
    const usage = chordsByUse([
      song({ id: 'a', content: '[C]Words [G]more', playCount: 3 }),
      song({ id: 'b', content: '[C]Words', playCount: 1 }),
    ]);

    expect(usage[0]).toEqual({ chord: 'C', count: 4 });
    expect(usage[1]).toEqual({ chord: 'G', count: 3 });
  });

  it('says nothing about a song that has never been played', () => {
    const usage = chordsByUse([song({ id: 'a', content: '[F]Words' })]);

    expect(usage).toHaveLength(0);
  });

  it('counts a chord once in a song, however often it is written', () => {
    const usage = chordsByUse([song({ id: 'a', content: '[C]One [C]Two [C]Three', playCount: 2 })]);

    expect(usage).toEqual([{ chord: 'C', count: 2 }]);
  });

  it('gives the names of the chords, the one reached for most first', () => {
    const names = frequentChordNames([
      song({ id: 'a', content: '[Am]Words', playCount: 5 }),
      song({ id: 'b', content: '[C]Words [D]more', playCount: 2 }),
    ]);

    expect(names).toEqual(['Am', 'C', 'D']);
  });

  it('keeps to the number asked for', () => {
    const names = frequentChordNames(
      [song({ id: 'a', content: '[C]Words [D]more [E]and [F]more [G]and', playCount: 1 })],
      2
    );

    expect(names).toHaveLength(2);
  });
});
