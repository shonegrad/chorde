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
    tags: ['rock', 'acoustic'],
    key: 'C',
    capo: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content: `{start_of_verse}
[C]Your chord [G]progression
[Am]With lyrics [F]here
    `
}
```

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

As of now: **20 songs** in the library (public domain seed songs)

## Roadmap to 1000 Songs

**Phase 1 (50 songs)**: Most requested classics

- Beatles, Oasis, Nirvana, etc.
- Focus on beginner-friendly songs

**Phase 2 (200 songs)**: Genre diversity

- Rock, Pop, Country, Folk, Jazz
- Range of difficulty levels

**Phase 3 (500 songs)**: Deep catalog

- Deep cuts from popular artists
- Regional/cultural variety

**Phase 4 (1000 songs)**: Comprehensive library

- User submissions
- Automated quality checks
- Community curation

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
