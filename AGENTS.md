# Chorde — Agent Instructions

## Project overview

Chorde is a ChordPro songbook application monorepo with three packages:

- `packages/web` — React 19 + Vite + MUI v7 frontend (dev: http://localhost:5173)
- `packages/api` — Hono API service for song search (dev: http://localhost:3001)
- `packages/shared` — Shared TypeScript types (source-only, no build)

## Common commands (run from repo root)

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm install`          | Install all workspace dependencies       |
| `npm run dev:all`      | Start web + API dev servers concurrently |
| `npm run dev`          | Start web frontend only                  |
| `npm run dev:api`      | Start API only                           |
| `npm run build`        | Build all workspaces                     |
| `npm run lint`         | Run ESLint across all workspaces         |
| `npm run test`         | Run Vitest across all workspaces         |
| `npm run format`       | Run Prettier across all packages         |
| `npm run format:check` | Check Prettier formatting                |

Package-specific scripts live in each `packages/*/package.json` (e.g. `test:e2e` for Playwright in web).

## Environment variables

- `packages/web/.env` — `VITE_API_URL=http://localhost:3001` (copy from `.env.example`)
- `packages/api/.env` — `PORT=3001`, `CORS_ORIGIN=<production origin>`

## Key files

- `packages/web/src/App.tsx` — Routing
- `packages/web/src/context/AppContext.tsx` — Library state (IndexedDB + seed songs)
- `packages/web/src/lib/libraryStore.ts` — IndexedDB + localStorage library store
- `packages/web/src/lib/chordPro.ts` — ChordPro parser
- `packages/web/src/lib/music.ts` — Chord transposition
- `packages/web/src/services/searchApi.ts` — API client (defaults to localhost:3001)
- `packages/api/src/index.ts` — Hono server + CORS config
- `packages/api/src/routes/search.ts` — Search route + source adapters
- `packages/api/src/routes/song.ts` — Song fetch route
- `packages/api/src/adapters/` — Source adapters (OpenHymnal, Hymnary, ChordProOrg)
- `packages/shared/src/index.ts` — Shared types (Song, SourceAdapter, etc.)

## Testing

- Unit tests: Vitest (`*.test.ts`, `*.test.tsx`)
- E2E tests: Playwright (`packages/web/e2e/app.spec.ts`)
- Run `npm run test` for unit tests; `npm run test:e2e` for E2E (requires dev servers running)

## Lint

ESLint with TypeScript rules; Prettier for formatting. Run `npm run lint` and `npm run format:check` before committing.

## Deployment

`npm run predeploy` builds the web app; `npm run deploy` publishes `packages/web/dist` to GitHub Pages. See `deploy.sh` and `DEPLOYMENT.md`.
