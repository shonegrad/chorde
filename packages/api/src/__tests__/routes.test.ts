import { describe, it, expect, vi } from 'vitest';
import { Hono } from 'hono';
import searchRoutes from '../routes/search.js';
import songRoutes from '../routes/song.js';

vi.mock('../adapters/openhymnal.js', () => ({
  OpenHymnalAdapter: class {
    id = 'openhymnal';
    name = 'OpenHymnal';
    async search(query: string) {
      if (query.includes('Amazing')) {
        return [
          {
            id: 'AmazingGrace',
            source: 'openhymnal',
            title: 'Amazing Grace',
            artist: 'John Newton',
            key: 'G',
          },
        ];
      }
      return [];
    }
    async fetchSong(_id: string) {
      if (_id === 'AmazingGrace') {
        return {
          chordPro: '{title: Amazing Grace}\n{artist: John Newton}\n\n[G]Amazing grace',
          metadata: { title: 'Amazing Grace', artist: 'John Newton', key: 'G' },
        };
      }
      return {
        chordPro: '{title: Not Found}\n\nNot found',
        metadata: { title: 'Not Found', artist: 'Unknown' },
      };
    }
  },
}));

vi.mock('../adapters/hymnary.js', () => ({
  HymnaryAdapter: class {
    id = 'hymnary';
    name = 'Hymnary.org';
    async search(query: string) {
      if (query.includes('Amazing')) {
        return [
          {
            id: 'amazing-grace',
            source: 'hymnary',
            title: 'Amazing Grace',
            artist: 'John Newton',
            hasChords: false,
          },
        ];
      }
      return [];
    }
    async fetchSong() {
      return {
        chordPro: '{title: Amazing Grace}\n{artist: John Newton}\n\nAmazing grace lyrics',
        metadata: { title: 'Amazing Grace', artist: 'John Newton' },
      };
    }
  },
}));

vi.mock('../adapters/chordproorg.js', () => ({
  ChordProOrgAdapter: class {
    id = 'chordpro';
    name = 'ChordPro.org';
    async search(query: string) {
      if (query.includes('Let')) {
        return [
          {
            id: 'let-it-be',
            source: 'chordpro',
            title: 'Let It Be',
            artist: 'The Beatles',
            key: 'C',
          },
        ];
      }
      return [];
    }
    async fetchSong() {
      return {
        chordPro: '{title: Let It Be}\n\n[C]When I find myself',
        metadata: { title: 'Let It Be', artist: 'The Beatles', key: 'C' },
      };
    }
  },
}));

function createTestApp() {
  const app = new Hono();
  app.route('/api', searchRoutes);
  app.route('/api', songRoutes);
  return app;
}

describe('Search Routes', () => {
  const app = createTestApp();

  describe('GET /api/sources', () => {
    it('returns all available sources', async () => {
      const res = await app.request('/api/sources');
      expect(res.status).toBe(200);
      const sources = (await res.json()) as { id: string; name: string; enabled: boolean }[];
      expect(sources).toHaveLength(4);
      expect(sources.map((s) => s.id)).toContain('openhymnal');
      expect(sources.map((s) => s.id)).toContain('hymnary');
      expect(sources.map((s) => s.id)).toContain('chordpro');
      expect(sources.map((s) => s.id)).toContain('session');
    });

    it('marks all sources as enabled', async () => {
      const res = await app.request('/api/sources');
      const sources = (await res.json()) as { id: string; name: string; enabled: boolean }[];
      sources.forEach((source) => {
        expect(source.enabled).toBe(true);
      });
    });
  });

  describe('GET /api/search', () => {
    it('returns search results for matching query', async () => {
      const res = await app.request('/api/search?q=Amazing');
      expect(res.status).toBe(200);
      const data = (await res.json()) as {
        results: { source: string; title: string }[];
        totalCount: number;
      };
      expect(data.results.length).toBeGreaterThan(0);
      expect(data.totalCount).toBeGreaterThan(0);
    });

    it('searches across all sources by default', async () => {
      const res = await app.request('/api/search?q=Amazing');
      const data = (await res.json()) as { results: { source: string }[]; totalCount: number };
      const sources = data.results.map((r) => r.source);
      expect(sources).toContain('openhymnal');
      expect(sources).toContain('hymnary');
    });

    it('filters by specific source', async () => {
      const res = await app.request('/api/search?q=Amazing&sources=openhymnal');
      const data = (await res.json()) as { results: { source: string }[]; totalCount: number };
      const sources = data.results.map((r) => r.source);
      expect(sources).toContain('openhymnal');
      expect(sources).not.toContain('hymnary');
    });

    it('returns 400 when no query provided', async () => {
      const res = await app.request('/api/search');
      expect(res.status).toBe(400);
    });

    it('returns empty results for non-matching query', async () => {
      const res = await app.request('/api/search?q=xyznonexistent123');
      const data = (await res.json()) as { results: unknown[]; totalCount: number };
      expect(data.results).toEqual([]);
      expect(data.totalCount).toBe(0);
    });
  });
});

describe('Song Routes', () => {
  const app = createTestApp();

  describe('GET /api/song/:source/:id', () => {
    it('returns song content for valid source and ID', async () => {
      const res = await app.request('/api/song/openhymnal/AmazingGrace');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { chordPro: string; metadata: { title: string } };
      expect(data.chordPro).toContain('Amazing Grace');
      expect(data.metadata.title).toBe('Amazing Grace');
    });

    it('returns 404 for unknown source', async () => {
      const res = await app.request('/api/song/unknownsource/someid');
      expect(res.status).toBe(404);
    });

    it('works with hymnary source', async () => {
      const res = await app.request('/api/song/hymnary/amazing-grace');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { chordPro: string };
      expect(data.chordPro).toContain('Amazing Grace');
    });

    it('works with chordpro source', async () => {
      const res = await app.request('/api/song/chordpro/let-it-be');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { chordPro: string };
      expect(data.chordPro).toContain('Let It Be');
    });
  });
});
