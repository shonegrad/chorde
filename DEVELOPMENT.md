# Development Guidelines for AI Agents

**Note**: This document contains guidelines specifically for AI agents working on the Chorde project.

## Start here

- [HANDOVER.md](./HANDOVER.md) — the state of the project, the rules it lives by, and what to do next
- [ROADMAP.md](./ROADMAP.md) — the plan
- [AGENTS.md](./AGENTS.md) — the commands, the key files and the conventions

## Setting up

```bash
npm install
```

This also builds `packages/shared`, which the web app and the API both compile against. If you
change the shared types, rebuild it:

```bash
npm run build -w @chorde/shared
```

## User Command: "commit+push"

When the user says "commit+push", execute the following steps in order:

1. **Stage all changes**: `git add -A`
2. **Commit with descriptive message**: Include what changed and why
3. **Push to GitHub**: `git push`
4. **Deploy to GitHub Pages**: `npm run deploy`

Example workflow:

```bash
# 1. Stage changes
git add -A
# 2. Commit
git commit -m "feat: add new feature"
# 3. Push
git push
# 4. Deploy
npm run deploy
```

The Pages workflow sometimes fails with a transient GitHub Actions error ("Failed to get ID Token",
"socket hang up"). That is GitHub's infrastructure, not the code. Re-run it:

```bash
gh run list --limit 1
gh run rerun <run-id>
```

## Port Management

**Check the port where the app is running, and if it is already running on a port, use it - don't spin up a new instance.**

When working with the development server:

- Always check if `npm run dev` is already running before starting a new instance
- The default development port is `5173`
- The API runs on `3001`
- Reuse the existing dev server to avoid port conflicts

## Version Management

Version is managed in `packages/web/src/version.ts` and the root `package.json`. Update when releasing a new version (not on every push):

1. Edit `packages/web/src/version.ts` and update `APP_VERSION`
2. Update root `package.json` version to match
3. Follow semantic versioning (MAJOR.MINOR.PATCH):
   - **PATCH** (0.0.x): Bug fixes, minor changes
   - **MINOR** (0.x.0): New features, backwards compatible
   - **MAJOR** (x.0.0): Breaking changes

Example:

```typescript
// packages/web/src/version.ts
export const APP_VERSION = '0.3.1'; // Update on release
```

## Browser Preview Best Practices

When previewing the app in the browser during development:

1. **Check for existing tabs first**: Before opening a new tab, check if there's already an open tab with `http://localhost:5173/`
2. **Reuse existing tabs**: If a tab exists, switch to it and refresh instead of opening a new one
3. **Avoid tab clutter**: This prevents accumulating multiple tabs of the same dev server

This helps keep your workspace clean and ensures you're always viewing the most current version.

## Code Style

- Use **TypeScript** for type safety
- Run `npm run lint` before committing
- Follow the existing project structure
- Use meaningful variable and function names
- **Do not put a button inside a button.** It is invalid markup and the inner button silently stops
  working. Keep action buttons as siblings of the thing they act on.

## Testing Changes

1. Start the dev server: `npm run dev`
2. Open or reuse browser tab at `http://localhost:5173/`
3. Test your changes thoroughly
4. Check browser console for errors
5. Test on both desktop and mobile viewports (if UI changes)

The unit tests run without a browser:

```bash
npm run test                       # every workspace
npm run test -w @chorde/web        # one workspace
npx vitest run src/lib/music.test.ts   # one file
```

The end-to-end tests start the dev server and the API themselves:

```bash
npm run test:e2e -w @chorde/web               # Chromium, WebKit and a phone
npx playwright test --project=chromium         # one browser, while working
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with descriptive messages
4. Push to your branch
5. Create a pull request
