import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchApi } from '../searchApi';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

describe('searchApi', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('getSources', () => {
    it('fetches sources from API', async () => {
      const mockSources = [
        { id: 'openhymnal', name: 'OpenHymnal', enabled: true },
        { id: 'hymnary', name: 'Hymnary.org', enabled: true },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSources),
      });

      const sources = await searchApi.getSources();
      expect(sources).toEqual(mockSources);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/sources')
      );
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(searchApi.getSources()).rejects.toThrow('Failed to fetch sources');
    });
  });

  describe('search', () => {
    it('sends search query to API', async () => {
      const mockResponse = {
        results: [{ id: '1', source: 'openhymnal', title: 'Test', artist: 'Artist' }],
        totalCount: 1,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await searchApi.search('test query');
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test+query')
      );
    });

    it('includes sources filter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], totalCount: 0 }),
      });

      await searchApi.search('test', ['openhymnal', 'hymnary']);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('sources=openhymnal%2Chymnary')
      );
    });

    it('throws error when search fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(searchApi.search('test')).rejects.toThrow('Search failed');
    });
  });

  describe('fetchSong', () => {
    it('fetches song by source and ID', async () => {
      const mockSong = {
        chordPro: '{title: Test}\n\n[C]Lyrics',
        metadata: { title: 'Test', artist: 'Artist' },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSong),
      });

      const result = await searchApi.fetchSong('openhymnal', 'test-id');
      expect(result).toEqual(mockSong);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/song/openhymnal/test-id')
      );
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(searchApi.fetchSong('openhymnal', 'test-id')).rejects.toThrow(
        'Failed to fetch song'
      );
    });
  });
});
