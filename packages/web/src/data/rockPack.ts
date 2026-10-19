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

export const ROCK_PACK: Song[] = [
  rockSong({
    id: 'rock-pack-wildwood-flower',
    title: 'Wildwood Flower',
    artist: 'Traditional Carter Family',
    tags: ['Folk', 'Traditional', 'Bluegrass', 'Easy'],
    key: 'C',
    bpm: 100,
    content: `{start_of_verse}
[C]Oh, I'll twine with my mingles and [G7]waiving black hair
With the [C]roses so red and the [G7]lilies so fair
And the [C]myrtle so bright with the [G7]emerald dew
The [C]pale and the [G7]lily and [C]blue

{start_of_chorus}
[C]I'll twine with my mingles and [G7]waiving black hair
[C]Until the day I [G7]die
[C]Poor [G7]old [C]heart,
[C]Pale [G7]lily and [C]blue`,
  }),
  rockSong({
    id: 'rock-pack-this-land-is-your-land',
    title: 'This Land Is Your Land',
    artist: 'Woody Guthrie',
    tags: ['Folk', 'Traditional', 'Protest'],
    key: 'G',
    bpm: 110,
    content: `{start_of_verse}
[G]This land is your land, this [C]land is my land
From [G]California to the [D7]New York Island
From the [G]redwood forest to the [C]gulf stream waters
This [G]land was made for [D7]you and [G]me

{start_of_chorus}
[G]As I was walking that [C]ribbon of highway
[G]I saw above me that [D7]endless skyway
[G]I saw below me that [C]golden valley
This [G]land was made for [D7]you and [G]me`,
  }),
  rockSong({
    id: 'rock-pack-you-are-my-sunshine',
    title: 'You Are My Sunshine',
    artist: 'Jimmie Davis',
    tags: ['Folk', 'Traditional', 'Easy', 'Children'],
    key: 'C',
    bpm: 100,
    content: `{start_of_verse}
[C]The other night dear, as I lay [F]sleeping
I [C]dreamed I held you in my [G7]arms
When [C]I awoke dear, I was [F]mistaken
And [C]I hung my head and [G7]cried

{start_of_chorus}
[C]You are my sunshine, my [F]only sunshine
[C]You make me happy when [G7]skies are gray
[C]You'll never know dear, how [F]much I love you
[C]Please don't take my [G7]sunshine [C]away`,
  }),
  rockSong({
    id: 'rock-pack-blues-stay-away-from-me',
    title: 'Blues Stay Away from Me',
    artist: 'Delmore Brothers',
    tags: ['Blues', 'Traditional', 'Country'],
    key: 'G',
    bpm: 90,
    content: `{start_of_verse}
[G]Blues stay away from me, [C]blues why don't you let me [G]be
Don't [D7]hang around my door, [C]blues I don't want you no [G]more

{start_of_chorus}
[G]Blues stay away from me, [C]blues why don't you let me [G]be
Don't [D7]hang around my door, [C]blues I don't want you no [G]more`,
  }),
  rockSong({
    id: 'rock-pack-i-saw-the-light',
    title: 'I Saw the Light',
    artist: 'Hank Williams',
    tags: ['Gospel', 'Country', 'Traditional'],
    key: 'G',
    bpm: 120,
    content: `{start_of_verse}
[G]I wandered so aimless, life filled with [C]sin
I [G]wouldn't let my dear [D7]Savior in
Then [G]Jesus came like a [C]stranger in the [G]night
[D7]Praise the Lord, I saw the [G]light

{start_of_chorus}
[G]I saw the light, I saw the [C]light
No more [G]darkness, no more [D7]night
Now I'm so [G]happy, no sorrow in [C]sight
[D7]Praise the Lord, I saw the [G]light`,
  }),
];
