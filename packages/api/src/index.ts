import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import searchRoutes from './routes/search.js';
import songRoutes from './routes/song.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const app = new Hono();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

const PRODUCTION_ORIGIN = process.env.CORS_ORIGIN || '';

app.use('*', logger());
app.use('/api/*', rateLimiter);
app.use(
  '/*',
  cors({
    origin: (origin) => {
      if (!origin) return '';
      if (ALLOWED_ORIGINS.includes(origin)) return origin;
      if (origin.startsWith('http://localhost:')) return origin;
      if (PRODUCTION_ORIGIN && origin === PRODUCTION_ORIGIN) return origin;
      return '';
    },
    credentials: true,
  })
);

app.route('/api', searchRoutes);
app.route('/api', songRoutes);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = parseInt(process.env.PORT || '3001');

console.log(`🎵 Chorde API server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
