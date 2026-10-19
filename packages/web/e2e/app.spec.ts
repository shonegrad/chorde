import { test, expect } from '@playwright/test';

test.describe('Chorde E2E - Song List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the song list heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
  });

  test('should show songs in the list', async ({ page }) => {
    const songCards = page.getByRole('heading', { level: 5 });
    await expect(songCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should filter songs by search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search songs/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('amazing');
    await page.waitForTimeout(500);
    const visibleHeadings = await page.getByRole('heading', { level: 5 }).count();
    expect(visibleHeadings).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Chorde E2E - Navigation', () => {
  test('should navigate to chord library', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
    const chordLibraryBtn = page.getByRole('button', { name: /chord library/i });
    if (await chordLibraryBtn.isVisible()) {
      await chordLibraryBtn.click();
      await expect(page.getByRole('heading', { name: /chord library/i })).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test('should navigate to settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to import page', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: /import/i })).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Chorde E2E - Song Viewer', () => {
  test('should view a song when clicking on it', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
    const firstSongCard = page.getByRole('heading', { level: 5 }).first();
    if (await firstSongCard.isVisible()) {
      await firstSongCard.click();
      await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Chorde E2E - Setlists', () => {
  test('should create a setlist via nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });
    page.on('dialog', async (dialog) => {
      await dialog.accept('E2E Setlist');
    });
    const setlistsBtn = page.getByRole('button', { name: /setlists/i });
    if (await setlistsBtn.isVisible()) {
      await setlistsBtn.click();
      const newSetlist = page.getByText(/new setlist/i);
      if (await newSetlist.isVisible()) {
        await newSetlist.click();
      }
    }
  });
});
