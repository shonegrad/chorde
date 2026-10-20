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
| Unit tests     | 305 (234 web, 68 api, 3 shared)                                |
| E2E tests      | 93, across Chromium, WebKit and a mobile viewport              |
| Deploy         | GitHub Pages, <https://shonegrad.github.io/chorde/>            |
| API            | Not hosted. Online search is hidden in production until it is. |

### What works

- **Reading** — chords sit directly above their word. Transposition is key-aware, so a song in B♭
  keeps its flats. Capo shows the key it actually sounds in. Nashville numbers, tabs and notation
  are available.
- **Writing** — a writing desk with autosave, undo and redo, earlier versions, a chord palette
  that offers the chords of your key first, key detection, a metronome, and transposition.
- **Performing** — a setlist carries how each song is played, and the performance view plays
  through them: count-in on the beat, auto-advance, printable running order.
- **Organising** — favourites, tags, sorting, searching inside lyrics, bulk actions, "My Songs",
  backup and restore.
- **Finding** — the key of a song is worked out from its chords, and every chord says where it sits
  in the key.

### What is known to be wrong

- **The "Notes" and "Tabs" modes are not real notation.** The key signature is inverted for flat
  keys (B♭ renders five sharps), chords are always spelled sharp, and 9th/11th/13th and ♭5 chords
  render wrongly. Milestone 4 replaces this with VexFlow. **Do not trust the current output.**
- **The API is not deployed**, so online search is hidden in production.
- **The library holds 16 songs.** That is on purpose, but it is thin.

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

## The next thing to do

**Milestone 6 — sound.** The metronome exists and works; the rest of the audio engine is written
but unreachable:

- `packages/web/src/lib/audio.ts` has `playNote`, `playChord`, `playScale` and `stopAllSounds`, none
  of which are called. `saveAudioPreferences` is never called, so the volume and the waveform are
  permanently at their defaults with no way to change them.
- The only sound in the app is a sine-wave strum on a chord card in the chord library.
- The count-in click is a square wave, and it does accent the first beat of each bar.

The smallest useful slice: a guitar-ish tone (a filtered sawtooth rather than the sine wave it uses
now), audio preferences with a way to change them, and playing the chord progression of the song
being read.

**After that, Milestone 4 — real notation** with VexFlow. The research is done and the decisions
are made:

- `vexflow@5.0.0`, **pinned exactly** (there has been no npm release in 19 months).
- Import from `vexflow/core` — 89 KB gzipped. The default entry is 676 KB and cannot be
  tree-shaken.
- **Never VexTab.** Its licence is non-commercial. Use `Factory.TabStave()` and `Factory.TabNote()`
  from the MIT core for tablature.
- React friction to plan for: the `Factory` needs a string element id (use `useId()`), `draw()` does
  not clear the container (React's StrictMode double-invokes effects and stacks two SVGs), the
  fonts must be awaited before the first draw, and the SVG cannot be themed with CSS so it has to
  be redrawn when the theme changes.
- VexFlow has no lyric engine, so the chord-over-lyrics view stays as it is. That is the right
  answer, not a compromise.
- Its SVG is not portable (it writes font codepoints, not paths), so the print sheet must keep
  using our own renderer.

## Things to know before you touch the code

- **The React Compiler is on** and it is strict. It rejects a `useCallback` with the wrong
  dependencies, and a hook called after an early return. If the compiler complains, the fix is
  usually to move the hook up or to correct the dependency list — not to disable it.
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
