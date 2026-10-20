import { describe, it, expect } from 'vitest';
import { BaseAdapter } from '../adapters/base.js';
import type { SearchResult, SongContent } from '@chorde/shared';

class TestAdapter extends BaseAdapter {
  id = 'test';
  name = 'Test';

  async search(query: string): Promise<SearchResult[]> {
    if (query === 'test') {
      return [{ id: '1', source: 'test', title: 'Test Song', artist: 'Test Artist' }];
    }
    return [];
  }

  async fetchSong(): Promise<SongContent> {
    return {
      chordPro: `{title: Test Song}\n{artist: Test Artist}\n{key: C}\n\n[C]Test lyrics`,
      metadata: { title: 'Test Song', artist: 'Test Artist', key: 'C' },
    };
  }
}

describe('BaseAdapter', () => {
  const adapter = new TestAdapter();

  describe('extractMetadata', () => {
    it('extracts title from ChordPro content', () => {
      const content = '{title: My Song}\n{artist: Artist}\n\nLyrics';
      const metadata = adapter.extractMetadata(content);
      expect(metadata.title).toBe('My Song');
    });

    it('extracts artist from ChordPro content', () => {
      const content = '{title: My Song}\n{artist: The Artist}\n\nLyrics';
      const metadata = adapter.extractMetadata(content);
      expect(metadata.artist).toBe('The Artist');
    });

    it('extracts key from ChordPro content', () => {
      const content = '{title: My Song}\n{key: G}\n\nLyrics';
      const metadata = adapter.extractMetadata(content);
      expect(metadata.key).toBe('G');
    });

    it('extracts capo from ChordPro content', () => {
      const content = '{title: My Song}\n{capo: 3}\n\nLyrics';
      const metadata = adapter.extractMetadata(content);
      expect(metadata.capo).toBe(3);
    });

    it('returns empty object when no metadata found', () => {
      const content = 'Just plain lyrics with no metadata';
      const metadata = adapter.extractMetadata(content);
      expect(metadata).toEqual({});
    });

    it('extracts all metadata at once', () => {
      const content = `{title: Full Song}
{artist: Full Artist}
{key: D}
{capo: 2}

[D]Verse lyrics`;
      const metadata = adapter.extractMetadata(content);
      expect(metadata).toEqual({
        title: 'Full Song',
        artist: 'Full Artist',
        key: 'D',
        capo: 2,
      });
    });
  });

  describe('normalizeChordPro', () => {
    it('trims whitespace', () => {
      const content = '  \n{title: Test}\n  ';
      const normalized = adapter.normalizeChordPro(content);
      expect(normalized).toBe('{title: Test}');
    });
  });
});
