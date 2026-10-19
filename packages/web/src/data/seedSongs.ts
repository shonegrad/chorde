import type { Song } from '../types';

// Simple hash function for content (in practice, you'd use a proper hashing library)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

export const SEED_SONGS: Song[] = [
  // PUBLIC DOMAIN & TRADITIONAL SONGS
  {
    id: 'traditional-amazing-grace',
    title: 'Amazing Grace',
    artist: 'Traditional Hymn',
    content: `{start_of_verse}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That saved a wretch like [D7]me
[G]I once was [G7]lost but [C]now I'm [G]found
Was [Em]blind but [D7]now I [G]see

{start_of_verse: Verse 2}
[G]'Twas [G7]grace that [C]taught my [G]heart to fear
And grace my fears re[D7]lieved
[G]How [G7]precious [C]did that [G]grace appear
The [Em]hour I [D7]first be[G]lieved`,
    format: 'chordpro',
    capo: 0,
    tags: ['Gospel', 'Traditional', 'Easy'],
    key: 'G',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'One of the most recognizable songs in the English-speaking world.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That saved a wretch like [D7]me
[G]I once was [G7]lost but [C]now I'm [G]found
Was [Em]blind but [D7]now I [G]see

{start_of_verse: Verse 2}
[G]'Twas [G7]grace that [C]taught my [G]heart to fear
And grace my fears re[D7]lieved
[G]How [G7]precious [C]did that [G]grace appear
The [Em]hour I [D7]first be[G]lieved`),
  },
  {
    id: 'traditional-kumbaya',
    title: 'Kumbaya',
    artist: 'Traditional Spiritual',
    content: `{start_of_verse}
[C]Kumbaya my Lord, [F]Kumba[C]ya
Kumbaya my Lord, [G7]Kumba[C]ya
Kumbaya my Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya

{start_of_verse: Verse 2}
[C]Someone's singing Lord, [F]Kumba[C]ya
Someone's singing Lord, [G7]Kumba[C]ya
Someone's singing Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya`,
    format: 'chordpro',
    capo: 0,
    tags: ['Gospel', 'Traditional', 'Easy'],
    key: 'C',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'A spiritual song with origins in African American culture.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[C]Kumbaya my Lord, [F]Kumba[C]ya
Kumbaya my Lord, [G7]Kumba[C]ya
Kumbaya my Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya

{start_of_verse: Verse 2}
[C]Someone's singing Lord, [F]Kumba[C]ya
Someone's singing Lord, [G7]Kumba[C]ya
Someone's singing Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya`),
  },
  {
    id: 'traditional-oh-susanna',
    title: 'Oh Susanna',
    artist: 'Stephen Foster',
    content: `{start_of_verse}
[C]I come from Alabama with my [G7]banjo on my knee
I'm [C]going to Louisiana, my [G7]true love for to [C]see
It [C]rained all night the day I left, the [G7]weather it was dry
The [C]sun so hot I froze to death, Su[G7]sanna don't you [C]cry

{start_of_chorus}
[C]Oh Susanna, oh [F]don't you cry for [C]me
I come from Alabama with my [G7]banjo on my [C]knee`,
    format: 'chordpro',
    capo: 0,
    tags: ['Folk', 'Traditional', 'Easy'],
    key: 'C',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: 'Stephen Foster',
      notes: 'Published in 1848, this song entered the public domain long ago.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[C]I come from Alabama with my [G7]banjo on my knee
I'm [C]going to Louisiana, my [G7]true love for to [C]see
It [C]rained all night the day I left, the [G7]weather it was dry
The [C]sun so hot I froze to death, Su[G7]sanna don't you [C]cry

{start_of_chorus}
[C]Oh Susanna, oh [F]don't you cry for [C]me
I come from Alabama with my [G7]banjo on my [C]knee`),
  },
  {
    id: 'traditional-will-the-circle-be-unbroken',
    title: 'Will the Circle Be Unbroken',
    artist: 'Traditional Bluegrass',
    content: `{start_of_verse}
[G]I was standing [G7]by my [C]window
On a [G]cold and cloudy [D7]day
When I [G]saw the hearse come [G7]rolling
For to [C]carry my [G]mother [D7]a[G]way

{start_of_chorus}
Will the [G]circle [G7]be un[C]broken
By and [G]by Lord by and [D7]by
There's a [G]better [G7]home a[C]waiting
In the [G]sky Lord [D7]in the [G]sky`,
    format: 'chordpro',
    capo: 0,
    tags: ['Folk', 'Traditional'],
    key: 'G',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'A traditional gospel song first recorded in 1935 by the Carter Family.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[G]I was standing [G7]by my [C]window
On a [G]cold and cloudy [D7]day
When I [G]saw the hearse come [G7]rolling
For to [C]carry my [G]mother [D7]a[G]way

{start_of_chorus}
Will the [G]circle [G7]be un[C]broken
By and [G]by Lord by and [D7]by
There's a [G]better [G7]home a[C]waiting
In the [G]sky Lord [D7]in the [G]sky`),
  },
  {
    id: 'traditional-clementine',
    title: 'Oh My Darling Clementine',
    artist: 'Traditional Folk',
    content: `{start_of_verse}
[C]In a cavern, in a canyon
Excavating for a [G7]mine
Dwelt a miner, forty-[C]niner
And his daughter Clemen[G7]tine[C]

{start_of_chorus}
[C]Oh my darling, oh my darling
Oh my darling Clemen[G7]tine
You are lost and gone for[C]ever
Dreadful sorry, Clemen[G7]tine[C]`,
    format: 'chordpro',
    capo: 0,
    tags: ['Folk', 'Traditional', 'Easy'],
    key: 'C',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'A Western folk ballad believed to have originated during the California Gold Rush.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[C]In a cavern, in a canyon
Excavating for a [G7]mine
Dwelt a miner, forty-[C]niner
And his daughter Clemen[G7]tine[C]

{start_of_chorus}
[C]Oh my darling, oh my darling
Oh my darling Clemen[G7]tine
You are lost and gone for[C]ever
Dreadful sorry, Clemen[G7]tine[C]`),
  },
  {
    id: 'traditional-greensleeves',
    title: 'Greensleeves',
    artist: 'Traditional English',
    content: `{start_of_verse}
[Am]Alas my [G]love you [Am]do me wrong
To [Am]cast me [E7]off dis[Am]courteously
And [Am]I have [G]loved you [Am]oh so long
De[Am]lighting [E7]in your [Am]company

{start_of_chorus}
[C]Greensleeves was [G]all my joy
[Am]Greensleeves was [E7]my delight
[C]Greensleeves was my [G]heart of gold
And [Am]who but my [E7]lady [Am]Greensleeves`,
    format: 'chordpro',
    capo: 0,
    tags: ['Folk', 'Traditional'],
    key: 'Am',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'A traditional English folk song dating back to at least 1580.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[Am]Alas my [G]love you [Am]do me wrong
To [Am]cast me [E7]off dis[Am]courteously
And [Am]I have [G]loved you [Am]oh so long
De[Am]lighting [E7]in your [Am]company

{start_of_chorus}
[C]Greensleeves was [G]all my joy
[Am]Greensleeves was [E7]my delight
[C]Greensleeves was my [G]heart of gold
And [Am]who but my [E7]lady [Am]Greensleeves`),
  },
  {
    id: 'traditional-house-of-the-rising-sun',
    title: 'House of the Rising Sun',
    artist: 'Traditional Folk',
    content: `{start_of_verse}
There [Am]is a [C]house in [D]New Or[F]leans
They [Am]call the [C]Rising [E7]Sun
And it's [Am]been the [C]ruin of [D]many a poor [F]boy
And [Am]God I [E7]know I'm [Am]one

{start_of_verse: Verse 2}
My [Am]mother [C]was a [D]tailor [F]
She [Am]sewed my [C]new blue [E7]jeans
My [Am]father [C]was a [D]gamblin' [F]man
[Am]Down in [E7]New Or[Am]leans`,
    format: 'chordpro',
    capo: 0,
    tags: ['Folk', 'Traditional'],
    key: 'Am',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes:
        'A traditional folk song of uncertain origin, most famously recorded by The Animals in 1964.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
There [Am]is a [C]house in [D]New Or[F]leans
They [Am]call the [C]Rising [E7]Sun
And it's [Am]been the [C]ruin of [D]many a poor [F]boy
And [Am]God I [E7]know I'm [Am]one

{start_of_verse: Verse 2}
My [Am]mother [C]was a [D]tailor [F]
She [Am]sewed my [C]new blue [E7]jeans
My [Am]father [C]was a [D]gamblin' [F]man
[Am]Down in [E7]New Or[Am]leans`),
  },
  {
    id: 'traditional-down-in-the-valley',
    title: 'Down in the Valley',
    artist: 'Traditional American Folk',
    content: `{start_of_verse}
[C]Down in the valley, valley so [G7]low
Hang your head over, hear the wind [C]blow
Hear the wind blow, dear, hear the wind [G7]blow
Hang your head over, hear the wind [C]blow

{start_of_verse: Verse 2}
[C]Roses love sunshine, violets love [G7]dew
Angels in heaven know I love [C]you
Know I love you, dear, know I love [G7]you
Angels in heaven know I love [C]you`,
    format: 'chordpro',
    capo: 0,
    tags: ['Folk', 'Traditional', 'Easy'],
    key: 'C',
    bpm: undefined,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Traditional',
      sourceUrl: '',
      license: 'public-domain',
      author: '',
      notes: 'A traditional American folk song also known as Birmingham Jail.',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: simpleHash(`{start_of_verse}
[C]Down in the valley, valley so [G7]low
Hang your head over, hear the wind [C]blow
Hear the wind blow, dear, hear the wind [G7]blow
Hang your head over, hear the wind [C]blow

{start_of_verse: Verse 2}
[C]Roses love sunshine, violets love [G7]dew
Angels in heaven know I love [C]you
Know I love you, dear, know I love [G7]you
Angels in heaven know I love [C]you`),
  },
];
