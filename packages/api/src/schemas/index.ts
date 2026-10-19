import { z } from 'zod';

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  enabled: z.boolean(),
});

export const SearchResultSchema = z.object({
  id: z.string(),
  source: z.string(),
  title: z.string(),
  artist: z.string(),
  key: z.string().optional(),
  preview: z.string().optional(),
  hasChords: z.boolean().optional(),
  license: z.string().optional(),
});

export const SongContentSchema = z.object({
  chordPro: z.string(),
  metadata: z.object({
    title: z.string(),
    artist: z.string(),
    key: z.string().optional(),
    capo: z.number().optional(),
  }),
  license: z.string().optional(),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Query parameter required'),
  sources: z.string().optional(),
});

export const SongParamsSchema = z.object({
  source: z.string().min(1),
  id: z.string().min(1),
});
