// Additional 30 popular songs to expand library to 50 total

const MORE_SONGS = [
    {
        id: 'eagles-hotel-california',
        title: 'Hotel California',
        artist: 'Eagles',
        tags: ['rock', '70s', 'classic'],
        key: 'Bm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[Bm] [F#] [A] [E]
[G] [D] [Em] [F#]

{start_of_verse}
[Bm]On a dark desert highway, [F#]cool wind in my hair
[A]Warm smell of colitas [E]rising up through the air
[G]Up ahead in the distance, [D]I saw a shimmering light
[Em]My head grew heavy and my sight grew dim
[F#]I had to stop for the night

{start_of_chorus}
[G]Welcome to the Hotel Cali[D]fornia
Such a [Em]lovely place, such a [F#]lovely face
[G]Plenty of room at the Hotel Cali[D]fornia
Any [Em]time of year, you can [F#]find it here`
    },
    {
        id: 'pink-floyd-wish-you-were-here',
        title: 'Wish You Were Here',
        artist: 'Pink Floyd',
        tags: ['rock', '70s', 'classic'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[Em7] [G] [Em7] [G]
[Em7] [A] [Em7] [A]

{start_of_verse}
[C]So, so you think you can [D]tell
Heaven from [Am]Hell, blue skies from [G]pain
Can you tell a green [D]field from a cold steel [C]rail
A smile from a [Am]veil? Do you think you can [G]tell?

{start_of_chorus}
How I wish, how I wish you were [C]here
We're just [D]two lost souls swimming in a fishbowl
[Am]Year after year
[G]Running over the same old ground
[D]What have we found? The same old [C]fears
Wish you were [Am]here [G]`
    },
    {
        id: 'bob-dylan-knockin-on-heavens-door',
        title: "Knockin' on Heaven's Door",
        artist: 'Bob Dylan',
        tags: ['folk', '70s', 'easy'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Mama take this [D]badge from [Am]me
[G]I can't [D]use it any[C]more
[G]It's getting [D]dark, too dark to [Am]see
[G]Feels like I'm [D]knockin' on heaven's [C]door

{start_of_chorus}
[G]Knock knock [D]knockin' on heaven's [Am]door
[G]Knock knock [D]knockin' on heaven's [C]door
[G]Knock knock [D]knockin' on heaven's [Am]door
[G]Knock knock [D]knockin' on heaven's [C]door`
    },
    {
        id: 'the-beatles-yesterday',
        title: 'Yesterday',
        artist: 'The Beatles',
        tags: ['pop', '60s', 'classic'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]Yesterday, [Em7]all my troubles seemed so [A7]far away
[Dm]Now it looks as though they're [Bb]here to stay
Oh [C]I be[Dm]lieve in [G]yester[Bb]day [F]

{start_of_verse: Verse 2}
[F]Suddenly, [Em7]I'm not half the [A7]man I used to be
[Dm]There's a shadow hanging [Bb]over me
Oh [C]yester[Dm]day came [G]sudden[Bb]ly [F]

{start_of_chorus}
[Em7]Why she [A7]had to [Dm]go I don't [C]know, she wouldn't [Bb]say
[Em7]I said [A7]some[Dm]thing wrong, now I [C]long for yester[Bb]day [F]`
    },
    {
        id: 'oasis-champagne-supernova',
        title: 'Champagne Supernova',
        artist: 'Oasis',
        tags: ['rock', '90s', 'britpop'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]How many special people change
[A/G]How many lives are living strange
[F#m]Where were you while we were getting [A]high

{start_of_verse: Verse 2}
[A]Slowly walking down the hall
[A/G]Faster than a cannonball
[F#m]Where were you while we were getting [A]high

{start_of_chorus}
Someday you will [A]find me
Caught beneath the [A/G]landslide
In a [D/F#]champagne supernova in the [E]sky
Someday you will [A]find me
Caught beneath the [A/G]landslide
In a [D/F#]champagne supernova
A [E]champagne supernova in the [A]sky`
    },
    {
        id: 'led-zeppelin-stairway-to-heaven',
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        tags: ['rock', '70s', 'classic', 'advanced'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[Am] [E+] [C] [D] [Fmaj7] [Am]

{start_of_verse}
There's a [Am]lady who's [E+]sure
All that [C]glitters is [D]gold
And she's [Fmaj7]buying a stairway to [Am]heaven

When she [Am]gets there she [E+]knows
If the [C]stores are all [D]closed
With a [Fmaj7]word she can get what she [Am]came for

{start_of_chorus}
[C]And she's [D]buying a [Fmaj7]stair[Am]way to [C]hea[D]ven [Fmaj7] [Am]`
    }
    // ... Continue adding more songs
];

// To merge with existing SEED_SONGS:
// import { SEED_SONGS } from './seedSongs';
// export const ALL_SONGS = [...SEED_SONGS, ...MORE_SONGS];
