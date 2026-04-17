import type { MiddlewareHandler } from 'hono';

const windowMs = 60 * 1000;
const maxRequests = 100;

const requests = new Map<string, { count: number; resetTime: number }>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of requests) {
    if (now > entry.resetTime) {
      requests.delete(key);
    }
  }
}

export const rateLimiter: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const now = Date.now();

  cleanup();

  const entry = requests.get(ip);
  if (!entry || now > entry.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs });
    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(maxRequests - 1));
    return next();
  }

  if (entry.count >= maxRequests) {
    c.header('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)));
    return c.json({ error: 'Too many requests, please try again later' }, 429);
  }

  entry.count++;
  c.header('X-RateLimit-Limit', String(maxRequests));
  c.header('X-RateLimit-Remaining', String(maxRequests - entry.count));
  return next();
};
