import { describe, it, expect } from 'vitest';
import { buildChordProContent } from '../export';
import type { Song } from '../../types';

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  key: 'G',
  content: '{title: Amazing Grace}\n{artist: John Newton}\n{key: G}\n\n[G]Amazing [C]grace',
  attribution: {
    sourceName: 'test',
    sourceUrl: '',
    license: 'public-domain',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('buildChordProContent', () => {
  it('leaves the content untouched when nothing is transposed', () => {
    const content = buildChordProContent(song);
    expect(content).toContain('[G]Amazing [C]grace');
    expect(content).toContain('{key: G}');
  });

  it('transposes the chords so the file matches the screen', () => {
    const content = buildChordProContent(song, { transpose: 2 });
    expect(content).toContain('[A]Amazing [D]grace');
  });

  it('updates the key directive to the transposed key', () => {
    const content = buildChordProContent(song, { transpose: 2 });
    expect(content).toContain('{key: A}');
    expect(content).not.toContain('{key: G}');
  });

  it('takes the capo into account for the sounding key', () => {
    const content = buildChordProContent(song, { capo: 2 });
    expect(content).toContain('{key: A}');
    expect(content).toContain('{capo: 2}');
  });

  it('adds a title when the source has none', () => {
    const content = buildChordProContent({ ...song, content: '[G]Amazing grace' });
    expect(content).toContain('{title: Amazing Grace}');
    expect(content).toContain('{artist: John Newton}');
  });
});
