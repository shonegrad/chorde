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
| Unit tests     | 428 (353 web, 68 api, 7 shared)                                |
| E2E tests      | 138, across Chromium, WebKit and a mobile viewport             |
| Deploy         | GitHub Pages, <https://shonegrad.github.io/chorde/>            |
| API            | Not hosted. Online search is hidden in production until it is. |

### What works

- **Reading** — chords sit directly above their word. Transposition is key-aware, so a song in B♭
  keeps its flats. Capo shows the key it actually sounds in. Nashville numbers, tabs and notation
  are available. A comment in a song is shown as a note, a chord grid is drawn, and a block of
  tablature is kept as it was written.
- **Writing** — a writing desk with autosave, undo and redo, earlier versions, a chord palette
  that offers the chords of your key first, key detection, a metronome, and transposition.
- **Performing** — a setlist carries how each song is played, and the performance view plays
  through them: count-in on the beat, auto-advance, printable running order. A set says how
  long it takes. On stage the view has the whole screen, the size of the words, a tempo that can
  be tapped in, the sections to jump to, and the next song to come.
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
- **Getting songs in** — ChordPro, OnSong and the old ChordPro format, from text, from files, from
  a folder, from a ZIP archive, or from the search. A file that holds several songs is imported as
  several songs.

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

**The API needs a host.** It is a decision rather than a piece of work: until it has one, online
search is hidden in production. Everything else in the app works without it.

What the app cannot do yet, and what a musician would notice:

- **There is no way to play along with a recording.** The app plays the chords of a song, and there
  is no backing track and no way to keep to one.
- **A song cannot be shared as a file of its own** in a way that keeps the words, the key and the
  chords together. The ChordPro file and the MIDI file each keep part of it.
- **The library is not a catalogue of what you want to learn.** There is no place to say "I want to
  learn this one", and so no list of what is left to learn.
- **The player cannot see the shape of the chord and the words together** while playing, only one
  or the other.

The work should be asked of the app in the same way as before — what does a musician need that it
cannot do yet.

The chords of a song can be written to a MIDI file. The parts worth knowing:

- `lib/midi.ts` writes a Standard MIDI File: a header, one track, the tempo, the time signature,
  and the notes of each chord, one chord to a bar.
- The chords are the shapes the library knows, so the file sounds the way the song is played, and
  the notes are struck one after another, the way a hand strums.
- The changes of the song are played, so the file is a loop of the progression to play along with.
- A chord the app cannot work out is left out rather than guessed at.

A song can be sent to somebody else. The parts worth knowing:

- `lib/shareLink.ts` puts the song into the link, squeezed down with the browser's own
  `CompressionStream`, so that the link is not too long. A song of a few hundred words is a link of
  about four hundred characters.
- There is no server to hold the song, so the link holds it. The app that opens the link reads the
  song out of it and offers to add it to the library.
- The link is shown in a window of its own, so that it can be copied by hand if the browser will
  not let the app write to the clipboard.
- `lib/deflate.ts` is the squeezing, and the ZIP reader uses it too.

A setlist can be written down. The parts worth knowing:

- `lib/setlistFile.ts` writes a setlist to a file and reads it back. The file is JSON, with the
  name, the key the set is played in, and how each song is played.
- The title of every song is kept in the file, and in the setlist itself, so a set reads properly
  even when a song is not in the library. A song that is not there is kept by its title.
- A song that is in the library is linked to it when the file is read in, by its id or by its
  title.
- The setlists are in the sidebar under "Setlists", with "Read a setlist" beside "New Setlist".

The chords a player reaches for most are done. The parts worth knowing:

- `lib/frequentChords.ts` works the chords out of the songs that have been played. A chord is
  counted once in a song, and the song counts as many times as it has been played.
- A song that has never been played says nothing about what the player reaches for, so it does not
  count.
- The chord library shows the list, and the writing desk offers those chords first, before the
  chords of the key.

The library knows what was played. The parts worth knowing:

- A song records when it was last opened and how many times it has been opened. The reader records
  it, once for each song, however many times the song is saved while it is open.
- The library can be sorted by "Recently played" and by "Most played", and the sidebar has
  "Recently Played" for the songs that have been played.
- A song can be marked as one the player knows. The reader has a mark beside the favourite, the
  library says "You know this" on the card, and the sidebar has "Songs I Know".
- A filter that is about playing says how the songs should be ordered too: "Recently played" is no
  use if the songs are then shown by title.

The player's own shapes are done. The parts worth knowing:

- `lib/customChords.ts` keeps the shapes a player has drawn, on the device, and never sends them
  anywhere. They survive a reload, which they did not before.
- A shape is put into the library of chords (`data/chordLibrary.ts`), so every part of the app
  draws the shape the player has for that chord: the diagram, the tablature, the stave.
- A shape for a chord the library already has replaces the library's own shape, and taking the
  player's shape away brings the library's shape back.
- The chord library shows which shapes are the player's own, and they can be taken away.
- A shape with only open strings used to be drawn with a fret number of infinity.

The writing desk is done. The parts worth knowing:

- The song is read back as it is written, with the chords over the words, under "As it will read".
  A person writing a song was writing blind.
- `lib/editorHistory.ts` groups the changes to the same thing that are made one after another, so
  that undo takes back a word and not a letter. The group is what was changed, and the changes
  have to be within `MERGE_WINDOW_MS` of each other.
- The key the editor thinks the song is in was shown as "[object Object]". It was the whole guess,
  not the key in it.

The library can now be arranged. The parts worth knowing:

- `lib/library.ts` groups the songs, sorts them, and transposes one for good.
- The songs can be gathered into groups by artist, key or tag. A song with three tags is in three
  groups, because that is what a tag is for, and a song with no key is in the group of the songs
  that have no key.
- The songs can be sorted by their length, their tempo or their capo, and a song that does not
  have the thing being sorted by goes at the end.
- "Missing details" finds the songs that do not say what key they are in, or how long they take.
- Several songs can be transposed together. The chords are moved and the key each song says it is
  in is moved with them, so the song still says the key it is in.

Printing is done. The parts worth knowing:

- `lib/printSheet.ts` builds the page for a song: the song itself, or the changes of the song,
  with the shapes of the chords it uses drawn at the foot of the page.
- The shapes are drawn by `components/ChordDiagram.tsx` in the app, and the drawing is what is
  printed, so that the page and the app agree about what a chord looks like. The print sheet
  turns them black, because a page of paper is black and white.
- `lib/printSetlist.ts` prints the running order, and with `includeSongs` the songs as well, one
  to a page.
- The chords sit exactly over their words. The printed page used to put the words after a chord
  on the chord's own row, which read as a mistake.

The performance view is done. The parts worth knowing:

- `components/SetlistPlayer.tsx` is the stage. The size of the words and the way they are written
  are the same preferences the reader uses (`lib/preferences.ts`), so nothing is set twice.
- The tempo of a song is often not written down, so it can be tapped in. The tapped tempo follows
  the song: it is forgotten when the next song starts.
- The screen is kept awake with `navigator.wakeLock`, and the lock is asked for again when the
  page comes back, because the browser releases it when the page is hidden.
- The sections are the ones the reader has (`components/SectionNav.tsx`), and the same scroll spy
  works out where you are in the song.

Milestone 5 (the rest of ChordPro) is done. The parts worth knowing:

- `lib/chordPro.ts` reads a directive before it reads anything else. Every directive is either
  something the app knows or something it keeps, so that the reader can say "there is something
  here I do not understand". Nothing is dropped: a line that carries a directive and some words
  keeps its words.
- A line that is not words carries an `annotation` (`SongAnnotation` in the shared package): a
  comment, a chord grid, a block of tablature, a block of chords on lines of their own, or
  something the app does not know. `components/SongBody.tsx` draws them.
- `{define:}` gives a name to a chord or to a phrase. A chord under another name is played as the
  chord it names; a word is put back into the words of the song.
- `splitChordProSongs` splits a file that holds more than one song. The import screen calls it, so
  a file of three songs is imported as three songs.
- Every item of a line knows the column it sits in, counted in the characters of the words. A
  chord is drawn at that place, which is where it was written. Two chords written over the same
  word are both shown, side by side above the word.

Milestone 7 (the other ways in) is done. The parts worth knowing:

- `packages/shared/src/onsong.ts` reads an OnSong file. It lives in the shared package because the
  search API needs it as well as the app, and there must be one set of rules.
- `packages/web/src/lib/importFormats.ts` reads the old `.crd` format and holds the list of the
  files the app can read. The old format has the chords in a line of their own, and they line up
  with the words by their place in the line, so reading it is a question of columns.
- `packages/web/src/lib/zip.ts` reads a ZIP archive. The browser can inflate a stream of
  compressed data, so all that is left to do is find the files inside the archive. There is no
  library for it, and none is needed.
- A dropped folder is read with `webkitGetAsEntry`, and the folder picker is `webkitdirectory`.
  Both were missing: a dropped folder used to yield nothing at all.

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
- **jsdom has no `Blob.arrayBuffer`**, which every browser has. It is filled in by
  `src/test/setup.ts`, because reading a ZIP archive needs it.

## Running it

```bash
npm install          # also builds the shared package
npm run dev:all      # the app on :5173 and the API on :3001
```

The online search needs the API. Without it the "Search Online" tab is hidden in a production
build and works in development.

```bash
npm run test         # the unit tests, once, and then it stops
npm run test:watch   # the unit tests, watching for changes
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
