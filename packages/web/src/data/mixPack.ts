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

const mixSong = (overrides: Partial<Song> & { content: string }): Song => ({
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

export const MIX_PACK: Song[] = [
  mixSong({
    id: 'mix-pack-this-little-light-of-mine',
    title: 'This Little Light of Mine',
    artist: 'Traditional Gospel',
    tags: ['Gospel', 'Traditional', 'Children', 'Easy'],
    key: 'C',
    bpm: 120,
    content: `{start_of_verse}
[C]This little light of mine, I'm [F]gonna let it [C]shine
This little light of mine, I'm [G7]gonna let it [C]shine
This little light of mine, I'm [F]gonna let it [C]shine
[C]Let it shine, [G7]let it shine, [C]let it shine`,
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'Traditional gospel song, public domain.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open' as const,
    origin: 'builtin' as const,
  }),
  mixSong({
    id: 'mix-pack-when-the-saints-go-marching-in',
    title: 'When the Saints Go Marching In',
    artist: 'Traditional',
    tags: ['Gospel', 'Traditional', 'Jazz', 'Easy'],
    key: 'F',
    bpm: 130,
    content: `{start_of_verse}
[F]Oh, when the saints go marching [C7]in
[F]Oh, when the saints go marching [C7]in
[Bb]Lord, I want to be in that [F]number
When the [C7]saints go marching [F]in`,
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'Traditional gospel/jazz standard, public domain.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open' as const,
    origin: 'builtin' as const,
  }),
];
