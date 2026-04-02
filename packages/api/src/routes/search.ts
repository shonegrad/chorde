import { Hono } from 'hono';
import { OpenHymnalAdapter } from '../adapters/openhymnal.js';
import { HymnaryAdapter } from '../adapters/hymnary.js';
import { ChordProOrgAdapter } from '../adapters/chordproorg.js';

const app = new Hono();

// Initialize adapters
const adapters = [
  new OpenHymnalAdapter(),
  new HymnaryAdapter(),
  new ChordProOrgAdapter(),
];

// GET /api/sources - List all available sources
app.get('/sources', (c) => {
  const sources = adapters.map(adapter => ({
    id: adapter.id,
    name: adapter.name,
    enabled: true,
  }));
  
  return c.json(sources);
});

// GET /api/search?q=query&sources=source1,source2
app.get('/search', async (c) => {
  const query = c.req.query('q') || '';
  const sourcesParam = c.req.query('sources') || '';
  
  if (!query) {
    return c.json({ error: 'Query parameter required' }, 400);
  }
  
  // Filter adapters by requested sources
  const requestedSources = sourcesParam ? sourcesParam.split(',') : [];
  const activeAdapters = requestedSources.length > 0
    ? adapters.filter(a => requestedSources.includes(a.id))
    : adapters;
  
  // Search all adapters in parallel
  const searchPromises = activeAdapters.map(adapter => 
    adapter.search(query).catch(err => {
      console.error(`Error searching ${adapter.id}:`, err);
      return [];
    })
  );
  
  const results = await Promise.all(searchPromises);
  const flatResults = results.flat();
  
  return c.json({
    results: flatResults,
    totalCount: flatResults.length,
  });
});

export default app;
