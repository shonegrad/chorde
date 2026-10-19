import { describe, it, expect } from 'vitest';
import { HymnaryAdapter } from '../adapters/hymnary.js';

describe('HymnaryAdapter', () => {
  const adapter = new HymnaryAdapter();

  describe('search', () => {
    it('returns matching hymns by title', async () => {
      const results = await adapter.search('Amazing');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Amazing');
    });

    it('returns matching hymns by author', async () => {
      const results = await adapter.search('Newton');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.artist.includes('Newton'))).toBe(true);
    });

    it('returns empty results for non-matching query', async () => {
      const results = await adapter.search('xyznonexistent123');
      expect(results).toEqual([]);
    });

    it('returns empty results for empty query', async () => {
      const results = await adapter.search('');
      expect(results).toEqual([]);
    });

    it('includes hasChords: false flag', async () => {
      const results = await adapter.search('Amazing');
      expect(results[0].hasChords).toBe(false);
    });

    it('is case insensitive', async () => {
      const resultsLower = await adapter.search('amazing grace');
      const resultsUpper = await adapter.search('AMAZING GRACE');
      expect(resultsLower).toEqual(resultsUpper);
    });
  });

  describe('fetchSong', () => {
    it('returns ChordPro content for valid hymn', async () => {
      const song = await adapter.fetchSong('amazing-grace');
      expect(song.chordPro).toContain('{title: Amazing Grace}');
      expect(song.chordPro).toContain('{artist: John Newton}');
    });

    it('includes lyrics in the content', async () => {
      const song = await adapter.fetchSong('amazing-grace');
      expect(song.chordPro).toContain('Amazing grace, how sweet the sound');
    });

    it('includes comment about no chords', async () => {
      const song = await adapter.fetchSong('amazing-grace');
      expect(song.chordPro).toContain('Lyrics only');
      expect(song.chordPro).toContain('no chords');
    });

    it('returns not found for invalid ID', async () => {
      const song = await adapter.fetchSong('nonexistent-hymn');
      expect(song.chordPro).toContain('Not Found');
    });

    it('extracts metadata from ChordPro', async () => {
      const song = await adapter.fetchSong('holy-holy-holy');
      expect(song.metadata.title).toBe('Holy, Holy, Holy');
      expect(song.metadata.artist).toBe('Reginald Heber');
    });
  });

  describe('id and name', () => {
    it('has correct adapter id', () => {
      expect(adapter.id).toBe('hymnary');
    });

    it('has correct adapter name', () => {
      expect(adapter.name).toBe('Hymnary.org');
    });
  });
});
