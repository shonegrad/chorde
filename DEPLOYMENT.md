# Deploying Chorde

## Prerequisites

- Ensure all changes are committed and pushed to `main`.

## Environment variables

The web app reads these at **build time** (Vite inlines them into the bundle):

| Variable                    | Required        | Purpose                                                           |
| --------------------------- | --------------- | ----------------------------------------------------------------- |
| `VITE_API_URL`              | Only for search | Base URL of the search API, e.g. `https://chorde-api.example.com` |
| `VITE_ENABLE_ONLINE_SEARCH` | No              | `true` shows the "Search Online" import tab, `false` hides it     |

**Online search is disabled in production builds by default**, because the API is not hosted yet.
Until you deploy the API, leave the flag unset (or set it to `false`) so users are not offered a
search that cannot work. The rest of the app - the seeded library, importing from pasted text or
files, editing, transposition and printing - works entirely offline and needs no backend.

If you serve the API from the same origin as the app (behind a reverse proxy), you only need
`VITE_ENABLE_ONLINE_SEARCH=true` and no `VITE_API_URL`; the app then calls `/api/...` relatively.

For local development, `packages/web/.env.development` points the app at `http://localhost:3001`.
That file is deliberately named `.env.development` so it is **not** picked up by production builds -
otherwise every deployed build would try to reach `localhost` on the visitor's machine.

## Deployment

Run the following command from the project root:

```bash
npm run deploy
```

This runs `predeploy` (builds the web app) then `deploy` (publishes `packages/web/dist` to GitHub
Pages via `gh-pages` CLI).

To enable online search, build with the flag set:

```bash
VITE_ENABLE_ONLINE_SEARCH=true VITE_API_URL=https://your-api-host npm run deploy
```

## Deploying the search API (optional)

The web app works entirely without the API. If you want online search, the API in `packages/api`
has to be running somewhere and the web build has to be told where it is.

The API needs two settings:

| Variable      | Purpose                                                       |
| ------------- | ------------------------------------------------------------- |
| `PORT`        | The port to listen on. Defaults to `3001`.                    |
| `CORS_ORIGIN` | The origin of the web app, e.g. `https://shonegrad.github.io` |

```bash
cd packages/api
PORT=3001 CORS_ORIGIN=https://your-web-host npm run build
node dist/index.js
```

Then build the web app with the address of the API:

```bash
VITE_ENABLE_ONLINE_SEARCH=true VITE_API_URL=https://your-api-host npm run deploy
```

If the API is served from the same origin as the web app, leave `VITE_API_URL` out and only set
`VITE_ENABLE_ONLINE_SEARCH=true`; the app then calls `/api/...` on its own host.

## Verifying Deployment

After the command completes, visit:
[https://shonegrad.github.io/chorde/](https://shonegrad.github.io/chorde/)

_Note: Changes may take a few minutes to propagate._
