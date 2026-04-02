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

// GET /api/song/:source/:id - Get full song content
app.get('/song/:source/:id', async (c) => {
  const source = c.req.param('source');
  const id = c.req.param('id');
  
  const adapter = adapters.find(a => a.id === source);
  
  if (!adapter) {
    return c.json({ error: 'Source not found' }, 404);
  }
  
  try {
    const song = await adapter.fetchSong(id);
    return c.json(song);
  } catch (err) {
    console.error(`Error fetching song ${id} from ${source}:`, err);
    return c.json({ error: 'Failed to fetch song' }, 500);
  }
});

export default app;
