# Development Guidelines for AI Agents

**Note**: This document contains guidelines specifically for AI agents working on the Chorde project.

## User Command: "commit+push"

When the user says "commit+push", execute the following steps in order:

- **Before commit+push, make sure to update the documentation comprehensively**

1. **Increment the version number** (following semantic versioning)
2. **Stage all changes**: `git add -A`
3. **Commit with descriptive message**: Include what changed and why
4. **Push to GitHub**: `git push`
5. **Deploy to GitHub Pages**: `./deploy.sh`

Example workflow:
```bash
# 1. Update version in src/version.ts (0.1.1 -> 0.1.2)
# 2. Stage changes
git add -A
# 3. Commit
git commit -m "feat: add new feature"
# 4. Push
git push
# 5. Deploy
./deploy.sh
```

This document contains important guidelines and best practices for developing Chorde.

## Port Management

**Check the port where the app is running, and if it is already running on a port, use it - don't spin up a new instance.**

When working with the development server:
- Always check if `npm run dev` is already running before starting a new instance
- The default development port is `5173`
- Reuse the existing dev server to avoid port conflicts

## Version Management

**IMPORTANT**: After every `git push` to the repository, increment the version number:

1. Edit `src/version.ts` and update `APP_VERSION`
2. Update `package.json` version to match (optional but recommended)
3. Follow semantic versioning (MAJOR.MINOR.PATCH):
   - **PATCH** (0.0.x): Bug fixes, minor changes
   - **MINOR** (0.x.0): New features, backwards compatible
   - **MAJOR** (x.0.0): Breaking changes

Example:
```typescript
// src/version.ts
export const APP_VERSION = '0.1.1'; // Increment after push
```

## Browser Preview Best Practices

When previewing the app in the browser during development:

1. **Check for existing tabs first**: Before opening a new tab, check if there's already an open tab with `http://localhost:5173/chorde/`
2. **Reuse existing tabs**: If a tab exists, switch to it and refresh instead of opening a new one
3. **Avoid tab clutter**: This prevents accumulating multiple tabs of the same dev server

This helps keep your workspace clean and ensures you're always viewing the most current version.

## Code Style

- Use **TypeScript** for type safety
- Run `npm run lint` before committing
- Follow the existing project structure
- Use meaningful variable and function names

## Testing Changes

1. Start the dev server: `npm run dev`
2. Open or reuse browser tab at `http://localhost:5173/chorde/`
3. Test your changes thoroughly
4. Check browser console for errors
5. Test on both desktop and mobile viewports (if UI changes)

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with descriptive messages
4. Push to your branch
5. **Update version number** (see Version Management above)
6. Create a pull request
