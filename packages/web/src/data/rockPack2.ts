import type { Song } from '../types';

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
  id: overrides.id ?? crypto.randomUUID(),
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
    license: 'Public Domain',
    author: overrides.artist,
    notes: '',
    ...(overrides.attribution ?? {}),
  },
  rightsStatus: 'open' as const,
  createdAt: overrides.createdAt ?? NOW,
  updatedAt: overrides.updatedAt ?? NOW,
  hash: overrides.hash ?? simpleHash(overrides.content),
});

export const ROCK_PACK_2: Song[] = [
  rockSong({
    id: 'rock2-pack-bury-me-beneath-the-willow',
    title: 'Bury Me Beneath the Willow',
    artist: 'Traditional Carter Family',
    tags: ['Folk', 'Traditional', 'Bluegrass', 'Sad'],
    key: 'G',
    bpm: 90,
    content: `{start_of_verse}
[G]Oh, [D7]bury me beneath the [G]willow
Under the [C]weeping [D7]willow [G]tree
So [D7]she may know where I am [G]sleeping
And [C]perhaps she'll [D7]weep for [G]me`,
  }),
  rockSong({
    id: 'rock2-pack-i-am-a-man-of-constant-sorrow',
    title: 'I Am a Man of Constant Sorrow',
    artist: 'Traditional',
    tags: ['Folk', 'Traditional', 'Bluegrass', 'Sad'],
    key: 'G',
    bpm: 100,
    content: `{start_of_verse}
[G]I am a man of constant [C]sorrow
I've seen [G]trouble all my [D7]days
I [G]bid farewell to old [C]Kentucky
The [G]place where I was [D7]born and [G]raised`,
  }),
  rockSong({
    id: 'rock2-pack-shady-grove',
    title: 'Shady Grove',
    artist: 'Traditional',
    tags: ['Folk', 'Traditional', 'Bluegrass'],
    key: 'Em',
    bpm: 110,
    content: `{start_of_verse}
[Em]Shady grove, my little [D]shady grove
Shady [Em]grove, my darling
[Em]Shady grove, my little [D]shady grove
[Em]Shady grove, my [D]darling`,
  }),
  rockSong({
    id: 'rock2-pack-cripple-creek',
    title: 'Cripple Creek',
    artist: 'Traditional',
    tags: ['Folk', 'Traditional', 'Bluegrass', 'Instrumental'],
    key: 'G',
    bpm: 140,
    content: `{start_of_verse}
[G]Cripple Creek, send the word [D]round
[G]Cripple Creek, send the word [D]round
[C]I'm goin' up to Cripple [D]Creek
[G]In a [D]little [G]town`,
  }),
  rockSong({
    id: 'rock2-pack-i-aint-got-nobody',
    title: "I Ain't Got Nobody",
    artist: 'Traditional',
    tags: ['Blues', 'Jazz', 'Traditional'],
    key: 'C',
    bpm: 120,
    content: `{start_of_verse}
[C]I ain't got nobody, and [F]nobody cares for [C]me
I [G7]ain't got nobody, so [F]sad and [C]lonely
[G7]Won't [F]some sweet [C]mama come and [G7]take a chance on [C]me`,
  }),
];
