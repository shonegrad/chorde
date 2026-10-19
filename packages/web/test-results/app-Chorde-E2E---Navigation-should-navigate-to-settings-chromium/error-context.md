# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Chorde E2E - Navigation >> should navigate to settings
- Location: e2e/app.spec.ts:40:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/settings
Call log:
  - navigating to "http://localhost:5173/settings", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Chorde E2E - Song List', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  |
  8  |   test('should display the song list heading', async ({ page }) => {
  9  |     await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
  10 |   });
  11 |
  12 |   test('should show songs in the list', async ({ page }) => {
  13 |     const songCards = page.getByRole('heading', { level: 5 });
  14 |     await expect(songCards.first()).toBeVisible({ timeout: 15000 });
  15 |   });
  16 |
  17 |   test('should filter songs by search', async ({ page }) => {
  18 |     const searchInput = page.getByPlaceholder(/search songs/i);
  19 |     await expect(searchInput).toBeVisible();
  20 |     await searchInput.fill('amazing');
  21 |     await page.waitForTimeout(500);
  22 |     const visibleHeadings = await page.getByRole('heading', { level: 5 }).count();
  23 |     expect(visibleHeadings).toBeGreaterThanOrEqual(0);
  24 |   });
  25 | });
  26 |
  27 | test.describe('Chorde E2E - Navigation', () => {
  28 |   test('should navigate to chord library', async ({ page }) => {
  29 |     await page.goto('/');
  30 |     await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
  31 |     const chordLibraryBtn = page.getByRole('button', { name: /chord library/i });
  32 |     if (await chordLibraryBtn.isVisible()) {
  33 |       await chordLibraryBtn.click();
  34 |       await expect(page.getByRole('heading', { name: /chord library/i })).toBeVisible({
  35 |         timeout: 10000,
  36 |       });
  37 |     }
  38 |   });
  39 |
  40 |   test('should navigate to settings', async ({ page }) => {
> 41 |     await page.goto('/settings');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/settings
  42 |     await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible({ timeout: 15000 });
  43 |   });
  44 |
  45 |   test('should navigate to import page', async ({ page }) => {
  46 |     await page.goto('/import');
  47 |     await expect(page.getByRole('heading', { name: /import/i })).toBeVisible({ timeout: 15000 });
  48 |   });
  49 | });
  50 |
  51 | test.describe('Chorde E2E - Song Viewer', () => {
  52 |   test('should view a song when clicking on it', async ({ page }) => {
  53 |     await page.goto('/');
  54 |     await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
  55 |     const firstSongCard = page.getByRole('heading', { level: 5 }).first();
  56 |     if (await firstSongCard.isVisible()) {
  57 |       await firstSongCard.click();
  58 |       await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible({ timeout: 10000 });
  59 |     }
  60 |   });
  61 | });
  62 |
  63 | test.describe('Chorde E2E - Setlists', () => {
  64 |   test('should create a setlist via nav', async ({ page }) => {
  65 |     await page.goto('/');
  66 |     await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
  67 |     page.on('dialog', async (dialog) => {
  68 |       await dialog.accept('E2E Setlist');
  69 |     });
  70 |     const setlistsBtn = page.getByRole('button', { name: /setlists/i });
  71 |     if (await setlistsBtn.isVisible()) {
  72 |       await setlistsBtn.click();
  73 |       const newSetlist = page.getByText(/new setlist/i);
  74 |       if (await newSetlist.isVisible()) {
  75 |         await newSetlist.click();
  76 |       }
  77 |     }
  78 |   });
  79 | });
  80 |
```
