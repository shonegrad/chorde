import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenHymnalAdapter } from '../adapters/openhymnal.js';

vi.stubGlobal('fetch', vi.fn());

describe('OpenHymnalAdapter', () => {
  const adapter = new OpenHymnalAdapter();

  beforeEach(() => {
    vi.resetAllMocks();
    (adapter as any).indexCache = null;
    (adapter as any).cacheTimestamp = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('search', () => {
    it('returns search results after fetching index', async () => {
      const mockIndex = {
        tree: [
          { type: 'blob', path: 'Amazing Grace.onsong' },
          { type: 'blob', path: 'Holy Holy Holy.onsong' },
          { type: 'blob', path: 'README.md' },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIndex),
      } as any);

      const results = await adapter.search('Amazing');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Amazing');
    });

    it('returns empty results for non-matching query', async () => {
      const mockIndex = {
        tree: [
          { type: 'blob', path: 'Amazing Grace.onsong' },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIndex),
      } as any);

      const results = await adapter.search('xyznonexistent');
      expect(results).toEqual([]);
    });

    it('returns empty results for empty query', async () => {
      const results = await adapter.search('');
      expect(results).toEqual([]);
    });

    it('uses cached index on subsequent searches', async () => {
      const mockIndex = {
        tree: [
          { type: 'blob', path: 'Amazing Grace.onsong' },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIndex),
      } as any);

      await adapter.search('Amazing');
      await adapter.search('Grace');
      
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchSong', () => {
    it('fetches and converts OnSong to ChordPro', async () => {
      const mockOnSong = `Title: Amazing Grace
Artist: John Newton
Key: [G]
CCLI: 22025

Chorus 1:
Am[G]azing Gr[G7]ace, how [C]sweet the so[G]und,
That s[G]aved a wr[G7]etch like [D]me.`;

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockOnSong),
      } as any);

      const song = await adapter.fetchSong('Amazing%20Grace.onsong');
      expect(song.chordPro).toContain('{title: Amazing Grace}');
      expect(song.chordPro).toContain('{artist: John Newton}');
      expect(song.chordPro).toContain('{key: G}');
    });

    it('returns not found for failed fetch', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as any);

      const song = await adapter.fetchSong('nonexistent.onsong');
      expect(song.chordPro).toContain('unavailable');
    });

    it('converts section markers to ChordPro format', async () => {
      const mockOnSong = `Title: Test Song
Key: [C]

Verse 1:
Some [C]lyrics here
Chorus:
The [G]chorus part`;

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockOnSong),
      } as any);

      const song = await adapter.fetchSong('Test%20Song.onsong');
      expect(song.chordPro).toContain('{start_of_verse1}');
      expect(song.chordPro).toContain('{start_of_chorus}');
    });
  });

  describe('id and name', () => {
    it('has correct adapter id', () => {
      expect(adapter.id).toBe('openhymnal');
    });

    it('has correct adapter name', () => {
      expect(adapter.name).toBe('OpenHymnal');
    });
  });
});
