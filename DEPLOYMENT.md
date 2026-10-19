# Deploying Chorde

## Prerequisites

- Ensure all changes are committed and pushed to `main`.

## Deployment

Run the following command from the project root:

```bash
npm run deploy
```

This runs `predeploy` (builds the web app) then `deploy` (publishes `packages/web/dist` to GitHub Pages via `gh-pages` CLI).

## Verifying Deployment

After the command completes, visit:
[https://shonegrad.github.io/chorde/](https://shonegrad.github.io/chorde/)

_Note: Changes may take a few minutes to propagate._
