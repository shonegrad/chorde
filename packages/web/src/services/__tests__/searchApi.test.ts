import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchApi } from '../searchApi';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

const requestedUrl = (callIndex = 0): string => mockFetch.mock.calls[callIndex][0] as string;

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
      expect(requestedUrl()).toContain('/api/sources');
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
      expect(requestedUrl()).toContain('q=test+query');
    });

    it('includes sources filter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [], totalCount: 0 }),
      });

      await searchApi.search('test', ['openhymnal', 'hymnary']);
      expect(requestedUrl()).toContain('sources=openhymnal%2Chymnary');
    });

    it('throws error when search fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(searchApi.search('test')).rejects.toThrow('Search failed');
    });

    it('surfaces the retry delay when the server rate limits the request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({ 'Retry-After': '30' }),
      });

      await expect(searchApi.search('test')).rejects.toThrow(/Too many requests.*30s/);
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
      expect(requestedUrl()).toContain('/api/song/openhymnal/test-id');
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(searchApi.fetchSong('openhymnal', 'test-id')).rejects.toThrow(
        'Failed to fetch song'
      );
    });
  });
});
