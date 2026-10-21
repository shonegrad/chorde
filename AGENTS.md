# Chorde — Agent Instructions

## Project overview

Chorde is a ChordPro songbook application monorepo with three packages:

- `packages/web` — React 19 + Vite + MUI v7 frontend (dev: http://localhost:5173)
- `packages/api` — Hono API service for song search (dev: http://localhost:3001)
- `packages/shared` — Shared TypeScript types. **Built** to `dist/` and consumed as a package by
  both the web app and the API, so there is only ever one definition of a type.

## Common commands (run from repo root)

| Command                | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `npm install`          | Install all workspace dependencies         |
| `npm run dev:all`      | Start web + API dev servers concurrently   |
| `npm run dev`          | Start web frontend only                    |
| `npm run dev:api`      | Start API only                             |
| `npm run build`        | Build shared, then web, then the API       |
| `npm run lint`         | Run ESLint across all workspaces           |
| `npm run test`         | Run Vitest across all workspaces, once     |
| `npm run test:watch`   | Run Vitest across all workspaces, watching |
| `npm run format`       | Run Prettier across all packages           |
| `npm run format:check` | Check Prettier formatting                  |

Package-specific scripts live in each `packages/*/package.json` (e.g. `test:e2e` for Playwright in
web, `verify:build` to check the built output).

**Build order matters.** `packages/shared` builds first, because the web app and the API both
compile against its declarations. `npm run build` at the root does this in the right order. If you
build a single package, build shared first, or use `tsc -b` which follows the project references.

## Environment variables

- `packages/web/.env.development` — `VITE_API_URL=http://localhost:3001` (dev only; copy from
  `.env.example`). Production builds must not bake in a localhost URL — see `DEPLOYMENT.md`.
- `packages/web/.env.production` — optional. `VITE_ENABLE_ONLINE_SEARCH=true` shows the online
  search tab. It is hidden by default because the API has no host yet.
- `packages/api/.env` — `PORT=3001`, `CORS_ORIGIN=<production origin>`

## Routes

| Route               | Screen                       |
| ------------------- | ---------------------------- |
| `/`                 | The library                  |
| `/song/:id`         | Reading a song               |
| `/song/:id/edit`    | Editing a song               |
| `/song/new`         | Writing a new song           |
| `/import`           | Importing songs              |
| `/chords`           | The chord library            |
| `/setlist/:id`      | A setlist                    |
| `/setlist/:id/play` | Performing a setlist         |
| `/settings`         | Settings, backup and restore |

The URL query string is the single source of truth for the library filter
(`?tag=`, `?artist=`, `?key=`, `?favourite=`, `?mine=`).

## Key files

### The web app

- `packages/web/src/App.tsx` — Routing, and the layout that holds the sidebar
- `packages/web/src/lib/useLibraryFilter.ts` — The library filter, read from the URL
- `packages/web/src/store/libraryStore.ts` — Zustand library state (IndexedDB + seed songs)
- `packages/web/src/store/setlistStore.ts` — Setlists, including how each song is played
- `packages/web/src/lib/libraryStore.ts` — The IndexedDB store. Opens the database lazily
- `packages/web/src/lib/chordPro.ts` — ChordPro parser: the directives, the sections, the
  comments, the grids, the tablature, and the splitting of a file that holds several songs
- `packages/web/src/lib/music.ts` — Chord and key transposition, with key-aware spelling
- `packages/web/src/lib/keyDetection.ts` — Works out the key of a song from its chords
- `packages/web/src/lib/guitar.ts` — Turns a chord shape into the notes it plays
- `packages/web/src/lib/chordSuggestions.ts` — The chords to offer while writing
- `packages/web/src/lib/editorHistory.ts` — Undo, redo and earlier versions
- `packages/web/src/lib/preferences.ts` — Persisted viewer preferences
- `packages/web/src/lib/settings.ts` — App settings (stage mode) shared by Settings and SongViewer
- `packages/web/src/lib/audio.ts` — The only place that makes a sound: the guitar tone, the click
  and the audio preferences
- `packages/web/src/lib/voicings.ts` — A chord name turned into the notes it plays
- `packages/web/src/lib/progression.ts` — The chords of a song, in order
- `packages/web/src/lib/chordTones.ts` — The notes of every chord quality, in semitones and steps
- `packages/web/src/lib/notation.ts` — How a chord is written down, and where a shape is played
- `packages/web/src/lib/fit.ts` — Whether a chord, or a whole song, is a chord of a key
- `packages/web/src/lib/duration.ts` — How long a song is, and how long a set of them takes
- `packages/web/src/lib/features.ts` — Feature flags (online search)
- `packages/web/src/lib/backup.ts` — Library backup format
- `packages/web/src/lib/useAutoScroll.ts` — The scrolling used by the reader and the performer
- `packages/web/src/lib/songPlayback.ts` — Getting a song ready to play in a key
- `packages/web/src/lib/printSetlist.ts` — The printable running order
- `packages/web/src/lib/printSheet.ts` — The printable page for a song, and the changes of a song
- `packages/web/src/lib/library.ts` — Grouping, sorting and transposing a library
- `packages/web/src/lib/importFormats.ts` — The files the app can read, and the old `.crd` format
- `packages/web/src/lib/zip.ts` — Reading a ZIP archive, with the browser's own inflater
- `packages/web/src/components/SongBody.tsx` — Chord-over-lyric rendering
- `packages/web/src/components/SongNote.tsx` — The note a song carries
- `packages/web/src/components/PrintDialog.tsx` — What to print, and how big it is
- `packages/web/src/components/SongEditor.tsx` — The writing desk
- `packages/web/src/components/SongViewer.tsx` — Reading a song
- `packages/web/src/components/SetlistPlayer.tsx` — Performing a setlist
- `packages/web/src/components/NavigationMenu.tsx` — The sidebar: every place in the app
- `packages/web/src/components/ChordNotation.tsx` — The staves and the tablature, drawn by VexFlow
- `packages/web/src/components/KeyView.tsx` — A key: its chords, and the songs that fit it
- `packages/web/src/components/MobileNav.tsx` — Bottom navigation for small screens
- `packages/web/src/components/editor/` — The chord palette and the metronome
- `packages/web/src/context/ThemeModeContext.tsx` — Light and dark themes
- `packages/web/src/services/searchApi.ts` — API client

### The API

- `packages/api/src/index.ts` — Hono server and CORS config
- `packages/api/src/routes/search.ts` — The search route
- `packages/api/src/routes/song.ts` — The song fetch route
- `packages/api/src/lib/ranking.ts` — Ranking and de-duplicating results
- `packages/api/src/adapters/` — Source adapters (OpenHymnal, Hymnary, ChordProOrg)

### Shared

- `packages/shared/src/index.ts` — The types both packages use (Song, Setlist, SearchResult, …)
- `packages/shared/src/onsong.ts` — Reading an OnSong file, for the app and the API alike

## Testing

- Unit tests: Vitest (`*.test.ts`, `*.test.tsx`). Around 430 of them.
- E2E tests: Playwright (`packages/web/e2e/app.spec.ts`) — runs against Chromium, WebKit and a
  mobile viewport. Playwright starts the dev server and the API itself.
- Run `npm run test` for the unit tests — it runs once and stops. Run `npm run test:watch` to
  watch. Run `npm run test:e2e -w @chorde/web` for the E2E tests, or
  `npx playwright test --project=chromium` for one browser.
- Tests that use the database need `fake-indexeddb`; import `fake-indexeddb/auto` at the top of the
  file.
- Do not use `indexedDB.deleteDatabase` to reset between tests. A connection that is still closing
  blocks the delete and leaves the next test waiting. Empty the store instead.
- jsdom has no `Blob.arrayBuffer`. `src/test/setup.ts` fills it in, because reading a ZIP archive
  needs it.

## Lint

ESLint with TypeScript rules; Prettier for formatting. Run `npm run lint` and `npm run format:check`
before committing. CI runs both, plus the unit tests, the type check, the build and the Playwright
suite.

Two rules that catch real mistakes here: the React Compiler complains when a `useCallback` or
`useMemo` has the wrong dependencies, and it refuses to compile a component where a hook is called
after an early return.

## Deployment

`npm run predeploy` builds the web app; `npm run deploy` publishes `packages/web/dist` to GitHub
Pages. See `DEPLOYMENT.md`. The Pages workflow occasionally fails with a transient GitHub Actions
OIDC error ("socket hang up"); re-run it with `gh run rerun <id>`.

## Where things stand

See [ROADMAP.md](./ROADMAP.md) for what has been done and what is next, and
[HANDOVER.md](./HANDOVER.md) for a summary of the project to hand to someone new.
