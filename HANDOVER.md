# Handover

This is the state of Chorde as of the last session, and what to do next. Read it before changing
anything, then read [ROADMAP.md](./ROADMAP.md) for the plan and [AGENTS.md](./AGENTS.md) for the
commands and the conventions.

## Starting a new session

Do these four things first:

1. `npm install` — this also builds `packages/shared`, which everything else compiles against.
2. `npm run dev:all` — the app on <http://localhost:5173> and the API on <http://localhost:3001>.
3. Read [AGENTS.md](./AGENTS.md) for the commands and the key files, and the "rules of this
   project" below.
4. Pick the next thing from "The next thing to do" and check `git log --oneline` first — the
   commit messages say what was _wrong_, not just what changed, and that is where the reasoning
   lives.

## What Chorde is

A local-first ChordPro songbook for musicians. You keep a library of songs in your browser, read
them with the chords above the words, transpose them, play them, and write your own.

**The product is the songbook, but the writer is the customer.** Most of the work in the last
sessions went into the writing desk and the performance view rather than into reading music, because
that is what the app is actually for.

## Where it stands

|                |                                                                |
| -------------- | -------------------------------------------------------------- |
| Built-in songs | 16, all public domain, checked by a test                       |
| Unit tests     | 375 (304 web, 68 api, 3 shared)                                |
| E2E tests      | 126, across Chromium, WebKit and a mobile viewport             |
| Deploy         | GitHub Pages, <https://shonegrad.github.io/chorde/>            |
| API            | Not hosted. Online search is hidden in production until it is. |

### What works

- **Reading** — chords sit directly above their word. Transposition is key-aware, so a song in B♭
  keeps its flats. Capo shows the key it actually sounds in. Nashville numbers, tabs and notation
  are available.
- **Writing** — a writing desk with autosave, undo and redo, earlier versions, a chord palette
  that offers the chords of your key first, key detection, a metronome, and transposition.
- **Performing** — a setlist carries how each song is played, and the performance view plays
  through them: count-in on the beat, auto-advance, printable running order. A setlist says how
  long it takes.
- **Organising** — favourites, tags, sorting, searching inside lyrics, bulk actions, "My Songs",
  backup and restore.
- **Getting about** — on a big screen a sidebar sits beside the music and stays in view, so every
  place in the app is one click away and you can see where you are. On a phone it is a drawer and
  a bottom bar.
- **The controls of a song** — in two rows on a big screen: what you do while playing, and how the
  song is set up. They wrap rather than scroll sideways, so nothing is ever out of reach. On a
  phone they are a short bar and a menu, so the song keeps the screen.
- **Finding** — the key of a song is worked out from its chords, and every chord says where it sits
  in the key. A key has a page of its own: the chords of the key, the songs that are in it, and the
  songs that could be played in it because every chord they use is a chord of the key.
- **Hearing** — the chords of a song can be played in the reader and on stage, a chord can be
  played from its diagram, and a scale can be played from the chord library. The tone is a guitar
  rather than a beep, and the volume, the tone and whether there is sound at all are set in the
  settings.

### What is known to be wrong

- **The API is not deployed**, so online search is hidden in production.
- **The library holds 16 songs.** That is on purpose, but it is thin.
- **The built-in songs have no length**, so a set of them cannot say how long it takes. A length
  comes from `{duration:}` in a ChordPro file, or from a song's details, and the app does not
  guess one: a set that is not fully timed says so.

## The rules of this project

These are the ones that matter. Breaking them is how the last set of bugs happened.

1. **Only public domain ships.** A song is only counted as public domain when the _song_ is out of
   copyright, not merely when a particular recording is. Adding a song means adding it to the
   reviewed list in `packages/web/src/lib/__tests__/songValidation.test.ts` — that test is the gate.
   "Blowin' in the Wind", "Leaving on a Jet Plane" and "He Ain't Heavy" were shipped for a while
   before this was noticed.
2. **Every chord shape is checked.** `packages/web/src/lib/__tests__/chordLibrary.test.ts` works out
   what each shape actually plays and compares it with the chord it claims to be. It found six wrong
   shapes and ten chords that could not be found at all.
3. **The shared types live in one place.** `packages/shared` is built and both packages import it.
   Do not add a second copy of a type — that is what made the licence field disappear once already.
4. **Do not nest buttons.** A button inside a button is invalid and the inner one silently stops
   working. It has happened twice (the song cards and the chord grid).
5. **The scroll is shared.** `lib/useAutoScroll.ts` is used by both the reader and the performer.
   Do not write a second scrolling loop.
6. **Keep the chord over its word.** The chord is absolutely positioned so a wide chord never
   pushes the lyrics apart. Do not go back to letting the chord take up room.
7. **All sound goes through `lib/audio.ts`.** The count-in, the metronome and the chords all play
   through it, so they follow the volume and the tone the user has chosen. A component that makes
   its own noise is a component that ignores the settings.

## The next thing to do

**Milestone 5 — the rest of ChordPro**, and then Milestone 7, the other ways in.

The work that is worth doing next, in the order it pays off:

- **The rest of ChordPro** (Milestone 5): comments and playing instructions (`{comment:}`,
  `{gc:}`), `{define:}`, `{duration:}`, multi-song files, real tab blocks, and the original column
  alignment so a chord written mid-word keeps its place.
- **OnSong, legacy `.crd` and ZIP folders** (Milestone 7). MusicXML and Guitar Pro are
  deliberately out of scope for now.
- **The API needs a host**, which is a decision rather than a piece of work: until it has one,
  online search is hidden in production.

Two things from this list are done. A setlist says how long it takes, from the lengths on the
songs (`lib/duration.ts`), and a key has a page of its own (`components/KeyView.tsx`) with the
chords of the key, the songs that are in it, and the songs that could be played in it because
every chord they use is a chord of the key (`lib/fit.ts`).

What the two of them have in common is that they answer a question the app could not answer
before: how long is this, and what can I play in this key. The next work should be asked of the
app in the same way — what does a musician need that it cannot do yet.

Milestone 6 (sound) is done. The parts worth knowing:

- `packages/web/src/lib/audio.ts` is the only place that makes a sound. It is a guitar tone: two
  sawtooth waves a few cents apart through a lowpass filter that falls as the note decays. The
  count-in click and the metronome go through it as well, so they follow the same settings.
- `lib/voicings.ts` turns a chord name into the notes it plays. It uses a shape from the chord
  library when there is one, and works the notes out when there is not.
- `lib/progression.ts` reads the chords of a song in order. A chord that follows itself is kept
  once; a chord that comes back later is kept, because that is what the song does.
- The volume, the tone and whether there is any sound are set in the settings, and the old
  waveform preference is folded into the new tone rather than lost.

Milestone 4 (real notation) is done. The parts worth knowing:

- `lib/notation.ts` works out how a chord is written down. The seventh of a chord is the seventh
  letter, so a minor seventh is a flattened seventh and not a sharpened sixth: that is why the
  chord on B♭ is B♭, D and F, and never A♯, D and F. `lib/chordTones.ts` holds the notes of
  every chord quality, in semitones and in letter steps, and both the notation and the guitar
  voicings read from it.
- `components/ChordNotation.tsx` draws the staves and the tablature with VexFlow. The library is
  loaded only when a chord is written out, and the music font is cut down to the two dozen glyphs
  a chord needs and kept in the app, so the notation works offline. See
  `packages/web/public/fonts/README.md`.
- The staves and the tablature are too big to sit over a word, so in a song each line of the
  words is written on one stave above it, and the clef and the key signature are only drawn at
  the start of the song. In the chord reference they are as big as they like.
- VexFlow draws the stems in black, whatever the theme, so a stem is invisible on a dark page.
  The stems are put in the colour of the ink after the drawing, and the writing is given a margin
  at the end so it is not cut off. There is a test for both.
- VexFlow hides the string under each number in a tablature with a rectangle in the colour of the
  page. The rectangle is invisible, but it is still a shape on the page, and it shows up wherever
  the page is not the colour it was drawn for. The string is broken around the number instead, and
  the rectangles are taken out.

Milestone 8 (a smarter library) is done. The parts worth knowing:

- `lib/duration.ts` reads a length and adds lengths up. A length is written the way a duration is,
  "4:28", and comes from `{duration:}` in a ChordPro file or from a song's details. Nothing is
  guessed: a set that is not fully timed says how much of it is known.
- `lib/fit.ts` decides whether a song belongs in a key. What matters is the note a chord is
  built on, not every note in it, so a dominant seventh and a secondary dominant are chords of the
  key, and a chord built on a note outside the key is not. The stricter rule — every note in the
  scale — was tried first and rejected the V7 of every minor key.
- `components/KeyView.tsx` is the page for a key. The keys in the sidebar lead to it rather than
  filtering the library, and the library can still be filtered by key from there.

## Things to know before you touch the code

- **The React Compiler is on** and it is strict. It rejects a `useCallback` with the wrong
  dependencies, and a hook called after an early return. If the compiler complains, the fix is
  usually to move the hook up or to correct the dependency list — not to disable it.
- **It also rejects `setState` inside an effect.** That is why the chord playback remembers the
  chords it started and compares them with the chords on the screen, rather than stopping the
  sound in an effect.
- **A hook in another module can confuse it.** `usePreparedSong` had to become a plain function
  wrapped in `useMemo` at the call site, because the compiler would not track the hook properly.
- **The library store opens the database lazily**, on first use, not in its constructor, so the
  module can be imported without a browser.
- **The IndexedDB tests empty the library rather than deleting the database.** Deleting is blocked
  by a connection that is still closing, and the next test then waits forever.
- **The `songIds` → `songs` change to setlists** is migrated when the setlists are read, so old
  setlists still work.
- **The build check** (`npm run verify:build`) fails the build if `dist/404.html` is missing or a
  localhost address has crept into the bundle. Both mistakes have happened.

## Running it

```bash
npm install          # also builds the shared package
npm run dev:all      # the app on :5173 and the API on :3001
```

The online search needs the API. Without it the "Search Online" tab is hidden in a production
build and works in development.

```bash
npm run test         # the unit tests
npm run test:e2e -w @chorde/web   # the end-to-end tests, all three browsers
npx playwright test --project=chromium   # just one browser, while working
```

Before committing: `npm run lint`, `npm run format:check`, `npm run test`. The commit hook runs
Prettier over what you staged.

## Committing and shipping

```bash
git add -A
git commit -m "feat: what changed and why"
git push
npm run deploy
```

`npm run deploy` publishes `packages/web/dist` to GitHub Pages. The Pages workflow sometimes fails
with a transient GitHub Actions OIDC error ("socket hang up"); re-run it with
`gh run rerun <id>`. It is not a problem with the code.

## If something is confusing

The history is worth reading for the reasons behind things. `git log --oneline` from the start; the
commit messages say what was wrong, not just what changed. The most useful ones are the ones that
fixed a wrong belief, such as "make every chord in the library play the notes it claims to" and
"remove every song that is not public domain".
