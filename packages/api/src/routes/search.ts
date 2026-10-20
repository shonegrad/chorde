import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { OpenHymnalAdapter } from '../adapters/openhymnal.js';
import { HymnaryAdapter } from '../adapters/hymnary.js';
import { ChordProOrgAdapter } from '../adapters/chordproorg.js';
import { SearchQuerySchema } from '../schemas/index.js';
import { dedupeResults, rankResults } from '../lib/ranking.js';
import type { SearchResult } from '@chorde/shared';

const app = new Hono();

/** How many results get their details read from the song files. */
const ENRICH_LIMIT = 10;

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
  const withLicenses = settled.flatMap(({ adapter, results }) =>
    results.map((result) => ({
      ...result,
      license: result.license ?? adapter.license ?? 'unknown',
    }))
  );

  // Rank once before enriching, so the effort of reading the song files is
  // spent on the best matches rather than on whatever the source listed first.
  const preliminarilyRanked = rankResults(withLicenses, query);
  const worthEnriching = new Set(
    preliminarilyRanked.slice(0, ENRICH_LIMIT).map((result) => `${result.source}:${result.id}`)
  );

  const enrichmentByKey = new Map<string, SearchResult>();

  await Promise.all(
    settled.map(async ({ adapter, results }) => {
      if (typeof adapter.enrichResults !== 'function') return;

      const targets = results.filter((result) =>
        worthEnriching.has(`${result.source}:${result.id}`)
      );
      if (targets.length === 0) return;

      try {
        const enriched = await adapter.enrichResults(targets, targets.length);
        enriched.forEach((result) => enrichmentByKey.set(`${result.source}:${result.id}`, result));
      } catch {
        // Keep the results as they are if the details cannot be read.
      }
    })
  );

  // Put the closest match first, and do not list the same song twice.
  const merged = preliminarilyRanked.map((result) => {
    const enriched = enrichmentByKey.get(`${result.source}:${result.id}`);
    if (!enriched) return result;
    return { ...enriched, license: enriched.license ?? result.license };
  });
  // The titles are only known once the details have been read, so the results
  // are ranked again to put them in the right order.
  const flatResults = dedupeResults(rankResults(merged, query));

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
