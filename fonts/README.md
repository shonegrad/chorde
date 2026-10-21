# The music font

Chorde draws its notation with the Bravura font, which VexFlow uses for the
clef, the note heads and the accidentals.

## What is here

| File                     | What it is                                                |
| ------------------------ | --------------------------------------------------------- |
| `Bravura-notation.woff2` | The font, cut down to the two dozen glyphs a chord needs. |
| `Bravura-LICENSE.txt`    | The licence the font comes with.                          |

The full font is a quarter of a megabyte and most of it is glyphs the app
never draws, so it is subsetted. The subset is 6 KB, which keeps the app
small and means the notation works offline, with no request to a font server.

## Where it comes from

Bravura is by Steinberg Media Technologies GmbH and is published under the
SIL Open Font License 1.1. The licence is in `Bravura-LICENSE.txt`.

The font is taken from the copy VexFlow carries
(`node_modules/vexflow/build/esm/src/fonts/bravura.js`) so that the version
and the licence always match the library that draws with it.

## Making it again

The subset is made by `packages/web/scripts/subset-font.mjs`, which lists the
glyphs it keeps. Run it with:

```bash
cd packages/web
node scripts/subset-font.mjs
```

If a glyph is ever missing, the notation draws a box instead of the note, so
the list of glyphs in that script is the thing to add to.
