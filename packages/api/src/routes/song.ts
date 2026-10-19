import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { OpenHymnalAdapter } from '../adapters/openhymnal.js';
import { HymnaryAdapter } from '../adapters/hymnary.js';
import { ChordProOrgAdapter } from '../adapters/chordproorg.js';
import { SessionAdapter } from '../adapters/session.js';
import { SongParamsSchema } from '../schemas/index.js';

const app = new Hono();

// Initialize adapters
const adapters = [
  new OpenHymnalAdapter(),
  new HymnaryAdapter(),
  new ChordProOrgAdapter(),
  new SessionAdapter(),
];

// GET /api/song/:source/:id - Get full song content
app.get('/song/:source/:id', zValidator('param', SongParamsSchema), async (c) => {
  const { source, id } = c.req.valid('param');

  const adapter = adapters.find((a) => a.id === source);

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
