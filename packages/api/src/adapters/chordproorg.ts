import { BaseAdapter } from './base.js';
import type { SearchResult, SongContent } from '../types.js';

interface ChordProExample {
  id: string;
  title: string;
  artist: string;
  key: string;
  content: string;
}

const CHORDPRO_EXAMPLES: ChordProExample[] = [
  {
    id: 'let-it-be',
    title: 'Let It Be',
    artist: 'The Beatles',
    key: 'C',
    content: `{title: Let It Be}
{artist: The Beatles}
{key: C}

{start_of_verse}
When I [C]find myself in times of [G]trouble
[F]Mother [C]Mary [G]comes to [F]me
[C]Speaking words of [G]wisdom
[F]Let it [C]be
{end_of_verse}

{start_of_chorus}
And [F]in my hour of [C]darkness
[G]She is standing [F]right in [C]front of [G]me
[F]Speaking words of [C]wisdom
[F]Let it [C]be
{end_of_chorus}`,
  },
  {
    id: 'blowin-in-the-wind',
    title: "Blowin' in the Wind",
    artist: 'Bob Dylan',
    key: 'G',
    content: `{title: Blowin' in the Wind}
{artist: Bob Dylan}
{key: G}

{start_of_verse}
How many [G]roads must a [C]man walk [G]down
Before you [C]call him a [G]man?
How many [G]seas must a [C]white dove [G]sail
Before she [C]sleeps in the [G]sand?
{end_of_verse}

{start_of_chorus}
The [G]answer my [C]friend is [G]blowin' in the [C]wind
The [G]answer is [C]blowin' in the [G]wind
{end_of_chorus}`,
  },
  {
    id: 'house-of-the-rising-sun',
    title: 'House of the Rising Sun',
    artist: 'Traditional',
    key: 'Am',
    content: `{title: House of the Rising Sun}
{artist: Traditional}
{key: Am}

{start_of_verse}
There is a [Am]house in [C]New Or[F]leans
They [D]call the [F]Rising [Am]Sun
And it's been the [C]ruin of [F]many a [Dm]poor [Am]boy
And [E]God I [Am]know I'm [E7]one
{end_of_verse}`,
  },
  {
    id: 'wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    key: 'F#m',
    content: `{title: Wonderwall}
{artist: Oasis}
{key: F#m}
{capo: 2}

{start_of_verse}
Today is [F#m]gonna be the day
That they're [D]gonna throw it back to [A]you
By now you [E]should've somehow
Realized [F#m]what you gotta [D]do
{end_of_verse}

{start_of_chorus}
And all the [A]roads that lead you [E]there were winding
And all the [F#m]lights that light up the [D]road
Are [A]shining so [E]bright
{end_of_chorus}`,
  },
  {
    id: 'stand-by-me',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    key: 'A',
    content: `{title: Stand By Me}
{artist: Ben E. King}
{key: A}

{start_of_verse}
When the [A]night has come
And the [F#m]land is dark
And the [D]moon is the [E]only light we'll [A]see
{end_of_verse}

{start_of_chorus}
No I [A]won't be afraid
Oh I [F#m]won't be afraid
Just as [D]long as you [E]stand
[A]Stand by [E]me
{end_of_chorus}`,
  },
  {
    id: 'knockin-on-heavens-door',
    title: "Knockin' on Heaven's Door",
    artist: 'Bob Dylan',
    key: 'G',
    content: `{title: Knockin' on Heaven's Door}
{artist: Bob Dylan}
{key: G}

{start_of_verse}
Mama take this [G]badge off of [D]me
I can't [Am]use it any[C]more
It's gettin' [G]dark too dark to [D]see
I feel I'm [Am]knockin' on [C]heaven's [G]door
{end_of_verse}`,
  },
  {
    id: 'redemption-song',
    title: 'Redemption Song',
    artist: 'Bob Marley',
    key: 'G',
    content: `{title: Redemption Song}
{artist: Bob Marley}
{key: G}

{start_of_verse}
Old [G]pirates yes they [Em]rob I
[C]Sold I to the [D]merchant ships
[C]Minutes after they took [G]I
From the [Em]bottomless [C]pit
{end_of_verse}

{start_of_chorus}
But my [G]hand was made [Em]strong
By the [C]hand of the [D]above
[C]We've been [G]forward in this [Em]generation
[C]Trod in [D]great tribulation
{end_of_chorus}`,
  },
  {
    id: 'hallelujah',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    key: 'C',
    content: `{title: Hallelujah}
{artist: Leonard Cohen}
{key: C}

{start_of_verse}
[C]I've heard there was a [Am]secret chord
That [C]David played and it [Am]pleased the Lord
But [F]you don't really [G]care for [C]music do [Am]you?
{end_of_verse}

{start_of_chorus}
It goes like [C]this the [F]fourth the [G]fifth
The [Am]minor fall the [F]major lift
The [G]baffled king com[E7]posing Halle[Am]lujah
{end_of_chorus}`,
  },
];

export class ChordProOrgAdapter extends BaseAdapter {
  id = 'chordpro';
  name = 'ChordPro.org';
  license = 'unknown';

  async search(query: string): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    return CHORDPRO_EXAMPLES.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery)
    ).map((song) => ({
      id: song.id,
      source: this.id,
      title: song.title,
      artist: song.artist,
      key: song.key,
    }));
  }

  async fetchSong(id: string): Promise<SongContent> {
    const song = CHORDPRO_EXAMPLES.find((s) => s.id === id);

    if (!song) {
      return {
        chordPro: `{title: Song Not Found}\n{artist: Unknown}\n\nSong content not available.`,
        metadata: { title: 'Song Not Found', artist: 'Unknown' },
      };
    }

    const metadata = this.extractMetadata(song.content);

    return {
      chordPro: this.normalizeChordPro(song.content),
      metadata: {
        title: metadata.title ?? 'Unknown',
        artist: metadata.artist ?? 'Unknown',
        ...metadata,
      },
    };
  }
}
