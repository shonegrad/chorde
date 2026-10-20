import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { OpenHymnalAdapter } from '../adapters/openhymnal.js';
import { HymnaryAdapter } from '../adapters/hymnary.js';
import { ChordProOrgAdapter } from '../adapters/chordproorg.js';
import { SearchQuerySchema } from '../schemas/index.js';

const app = new Hono();

// Initialize adapters
const adapters = [new OpenHymnalAdapter(), new HymnaryAdapter(), new ChordProOrgAdapter()];

// GET /api/sources - List all available sources
app.get('/sources', (c) => {
  const sources = adapters.map((adapter) => ({
    id: adapter.id,
    name: adapter.name,
    enabled: true,
    license: adapter.license || 'unknown',
  }));

  return c.json(sources);
});

// GET /api/search?q=query&sources=source1,source2
app.get('/search', zValidator('query', SearchQuerySchema), async (c) => {
  const { q: query, sources: sourcesParam = '' } = c.req.valid('query');

  // Filter adapters by requested sources
  const requestedSources = sourcesParam ? sourcesParam.split(',') : [];
  const activeAdapters =
    requestedSources.length > 0
      ? adapters.filter((a) => requestedSources.includes(a.id))
      : adapters;

  // Search all adapters in parallel
  const settled = await Promise.all(
    activeAdapters.map(async (adapter) => {
      try {
        return { adapter, results: await adapter.search(query), error: null as string | null };
      } catch (err) {
        console.error(`Error searching ${adapter.id}:`, err);
        return {
          adapter,
          results: [] as Awaited<ReturnType<typeof adapter.search>>,
          error: err instanceof Error ? err.message : 'Search failed',
        };
      }
    })
  );

  // Every result carries the license of the source it came from, so the client
  // can decide whether an import needs a rights confirmation.
  const flatResults = settled.flatMap(({ adapter, results }) =>
    results.map((result) => ({
      ...result,
      license: result.license ?? adapter.license ?? 'unknown',
    }))
  );

  // A source that failed is reported separately rather than silently returning
  // "no results", which is indistinguishable from a genuine miss.
  const failedSources = settled
    .filter((entry) => entry.error !== null)
    .map((entry) => ({ source: entry.adapter.id, name: entry.adapter.name, error: entry.error }));

  return c.json({
    results: flatResults,
    totalCount: flatResults.length,
    failedSources,
  });
});

export default app;
