import { describe, it, expect } from 'vitest';
import { ChordProOrgAdapter } from '../adapters/chordproorg.js';

describe('ChordProOrgAdapter', () => {
  const adapter = new ChordProOrgAdapter();

  describe('search', () => {
    it('returns matching songs by title', async () => {
      const results = await adapter.search('Let It Be');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe('Let It Be');
    });

    it('returns matching songs by artist', async () => {
      const results = await adapter.search('Beatles');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.artist.includes('Beatles'))).toBe(true);
    });

    it('returns multiple results for broad query', async () => {
      const results = await adapter.search('Bob');
      expect(results.length).toBeGreaterThan(1);
    });

    it('returns empty for non-matching query', async () => {
      const results = await adapter.search('xyznonexistent123');
      expect(results).toEqual([]);
    });

    it('returns empty for empty query', async () => {
      const results = await adapter.search('');
      expect(results).toEqual([]);
    });

    it('includes source and key in results', async () => {
      const results = await adapter.search('Wonderwall');
      expect(results[0].source).toBe('chordpro');
      expect(results[0].key).toBe('F#m');
    });

    it('is case insensitive', async () => {
      const resultsLower = await adapter.search('wonderwall');
      const resultsUpper = await adapter.search('WONDERWALL');
      expect(resultsLower).toEqual(resultsUpper);
    });
  });

  describe('fetchSong', () => {
    it('returns ChordPro content for valid song', async () => {
      const song = await adapter.fetchSong('let-it-be');
      expect(song.chordPro).toContain('{title: Let It Be}');
      expect(song.chordPro).toContain('{artist: The Beatles}');
    });

    it('includes chords in content', async () => {
      const song = await adapter.fetchSong('let-it-be');
      expect(song.chordPro).toContain('[C]');
      expect(song.chordPro).toContain('[G]');
    });

    it('includes section markers', async () => {
      const song = await adapter.fetchSong('let-it-be');
      expect(song.chordPro).toContain('{start_of_verse}');
      expect(song.chordPro).toContain('{start_of_chorus}');
    });

    it('returns not found for invalid ID', async () => {
      const song = await adapter.fetchSong('nonexistent-song');
      expect(song.chordPro).toContain('Not Found');
    });

    it('extracts metadata from ChordPro', async () => {
      const song = await adapter.fetchSong('hallelujah');
      expect(song.metadata.title).toBe('Hallelujah');
      expect(song.metadata.artist).toBe('Leonard Cohen');
      expect(song.metadata.key).toBe('C');
    });

    it('includes capo when present', async () => {
      const song = await adapter.fetchSong('wonderwall');
      expect(song.chordPro).toContain('{capo: 2}');
    });
  });

  describe('id and name', () => {
    it('has correct adapter id', () => {
      expect(adapter.id).toBe('chordpro');
    });

    it('has correct adapter name', () => {
      expect(adapter.name).toBe('ChordPro.org');
    });
  });
});
