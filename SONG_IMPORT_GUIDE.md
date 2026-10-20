# Song Import Guide

## Overview

This app supports ChordPro format for storing guitar chord sheets. You can import songs in several ways.

## ChordPro Format

ChordPro is a simple text format for guitar chords:

```chordpro
{title: Song Title}
{artist: Artist Name}
{key: C}
{capo: 0}

{start_of_verse}
[C]Lyric with chord [G]above
[Am]More lyrics [F]here
{end_of_verse}

{start_of_chorus}
[F]Chorus [C]lyrics
[G]With [Am]chords
{end_of_chorus}
```

## Method 1: Manual Addition to seedSongs.ts

1. Open `packages/web/src/data/seedSongs.ts`
2. Add a new song object:

```typescript
{
    id: 'artist-song-title',
    title: 'Song Title',
    artist: 'Artist Name',
    tags: ['folk', 'acoustic'],
    key: 'C',
    capo: 0,
    attribution: {
        sourceName: 'Traditional',
        sourceUrl: '',
        license: 'public-domain',
        author: 'Artist Name',
        notes: 'Where this came from and why it is public domain.',
        verifiedBy: 'manual',
    },
    rightsStatus: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `{start_of_verse}
[C]Your chord [G]progression
[Am]With lyrics [F]here
    `
}
```

A song added this way also has to be added to the reviewed list in
`packages/web/src/lib/__tests__/songValidation.test.ts`, which is what keeps the repository
honest about what is public domain.

## Method 2: User Import Feature (In-App)

Users can paste ChordPro text directly in the app via the Import dialog (Paste/Drop tab).

## Finding Songs

### Legal Sources:

1. **ChordPro.org** - Official format documentation with examples
2. **OpenSong** - Open-source worship song database
3. **Public Domain Songs** - Pre-1928 songs are public domain in the US
4. **Creative Commons** - Search for CC-licensed tabs
5. **Your Own Transcriptions** - Any song you personally tab out

### Conversion Tools:

- Ultimate Guitar → ChordPro (manual conversion needed)
- PDF tabs → Manual transcription
- Guitar Pro files → Export as ChordPro

## Best Practices

### Quality Over Quantity

- 100 accurate songs > 1000 questionable tabs
- Verify chord accuracy
- Test playability

### Tagging Strategy

```typescript
tags: [
  'genre', // rock, pop, country, jazz
  'difficulty', // easy, intermediate, advanced
  'style', // acoustic, electric, fingerstyle
  'era', // 60s, 70s, 80s, 90s, 2000s, 2010s, 2020s
  'occasion', // worship, campfire, performance
];
```

### Metadata Completeness

Always include:

- ✅ Title and Artist
- ✅ Original Key
- ✅ Capo position (if used in popular versions)
- ⚠️ Tempo (optional but helpful)
- ⚠️ Time signature (if not 4/4)

## Current Song Count

As of now: **16 songs** in the built-in library, all public domain. Your own transcriptions and
imports are added on top of that, and are only ever in your browser.

## How the library grows

The built-in library stays small and safe. It grows in three ways:

**1. Your own songs.** Most of what you will add is your own work - songs you have written, or
transcriptions of songs you know. Those are yours, and they belong in your own library.

**2. Public domain material.** Traditional songs, hymns and folk songs that are out of copyright.
There are thousands of these, and they can be added one at a time, each one checked.

**3. Creative Commons material.** Where the licence allows sharing.

What the library does **not** do is carry popular commercial songs. Chords for "Wonderwall" or
"Hotel California" are someone's copyright, and the ChordPro text for them is no less
copyrighted than a recording. If you want those in your library, transcribe them yourself - that
is a personal use, and it is what this app is for.

The quality bar matters more than the count: a hundred accurate transcriptions are worth more
than a thousand shaky ones.

## Legal Note

⚠️ **Important**: ChordPro chord sheets may be subject to copyright. Only import:

1. Songs you've personally transcribed
2. Public domain compositions
3. Creative Commons licensed content
4. Songs with explicit permission

**Do NOT scrape** commercial tab sites like Ultimate Guitar, Songsterr, etc. without permission.

## Contributing Songs

If you want to contribute songs to the project:

1. Ensure you have rights to share them
2. Format them in ChordPro
3. Verify chord accuracy
4. Submit via pull request or issue
