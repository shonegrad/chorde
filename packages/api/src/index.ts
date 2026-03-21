import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import searchRoutes from './routes/search.js';
import songRoutes from './routes/song.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('/*', cors({
  origin: (origin) => {
    // Allow any localhost in development
    if (origin.startsWith('http://localhost:')) {
      return origin;
    }
    // Allow specific production domains if needed
    return origin; 
  },
  credentials: true,
}));

// Routes
app.route('/api', searchRoutes);
app.route('/api', songRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = parseInt(process.env.PORT || '3002');

console.log(`🎵 Chorde API server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
