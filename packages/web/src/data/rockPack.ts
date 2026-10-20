import type { Song } from '../types';
import { createId } from '../lib/id';

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const NOW = new Date().toISOString();

const rockSong = (overrides: Partial<Song> & { content: string }): Song => ({
  id: overrides.id ?? createId(),
  title: overrides.title ?? 'Untitled',
  artist: overrides.artist ?? 'Unknown Artist',
  content: overrides.content,
  format: 'chordpro' as const,
  capo: overrides.capo ?? 0,
  tags: overrides.tags ?? [],
  key: overrides.key ?? 'C',
  bpm: overrides.bpm ?? 120,
  timeSignature: overrides.timeSignature ?? '4/4',
  attribution: {
    sourceName: 'Traditional',
    sourceUrl: '',
    license: 'public-domain',
    author: overrides.artist,
    notes: '',
    verifiedBy: 'auto',
    ...(overrides.attribution ?? {}),
  },
  rightsStatus: 'open' as const,
  origin: 'builtin' as const,
  createdAt: overrides.createdAt ?? NOW,
  updatedAt: overrides.updatedAt ?? NOW,
  hash: overrides.hash ?? simpleHash(overrides.content),
});

export const ROCK_PACK: Song[] = [
  rockSong({
    id: 'rock-pack-wildwood-flower',
    title: 'Wildwood Flower',
    artist: 'Traditional Carter Family',
    tags: ['Folk', 'Traditional', 'Bluegrass', 'Easy'],
    key: 'C',
    bpm: 100,
    content: `{start_of_verse}
[C]Oh, I'll twine with my [C]mingles and [C]waving black hair
With the [C]roses so red and the [C]lilies so fair
And the [C]myrtle so bright with the [C]emerald dew
The [C]pale and the [C]lily and [C]blue

{start_of_chorus}
[C]I'll twine with my [C]mingles and [C]waving black hair
[C]Until the day I [C]die
[C]Poor [C]old [C]heart,
[C]Pale [C]lily and [C]blue`,
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'Traditional Carter Family song, public domain.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open' as const,
    origin: 'builtin' as const,
  }),
];
