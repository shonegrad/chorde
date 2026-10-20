import { test, expect, type Page } from '@playwright/test';

/**
 * On narrow viewports the navigation lives behind a menu button, so it has to
 * be opened before the items inside it can be used.
 */
const openNavigation = async (page: Page) => {
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeVisible();
  }
};

test.describe('Chorde E2E - Song List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('shows the song list heading with a song count', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /my songs/i });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/My Songs \(\d+\)/);
  });

  test('lists songs from the seeded library', async ({ page }) => {
    const songCards = page.getByRole('heading', { level: 2 });
    await expect(songCards.first()).toBeVisible({ timeout: 15000 });
    expect(await songCards.count()).toBeGreaterThan(0);
  });

  test('filters songs by the search box', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search songs, artists/i);
    await expect(searchInput).toBeVisible();

    const before = await page.getByRole('heading', { level: 2 }).count();
    await searchInput.fill('amazing');
    await expect(page.getByRole('heading', { name: /my songs/i })).not.toHaveText(
      new RegExp(`My Songs \\(${before}\\)`)
    );

    const after = await page.getByRole('heading', { level: 2 }).count();
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(before);
  });

  test('shows the empty state when nothing matches', async ({ page }) => {
    await page.getByPlaceholder(/search songs, artists/i).fill('zzzznotarealsongzzzz');
    await expect(page.getByText('No songs found')).toBeVisible();
  });
});

test.describe('Chorde E2E - Navigation', () => {
  test('opens the chord library', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Chord Library' }).first().click();

    await expect(page.getByRole('heading', { name: 'Chord Library' })).toBeVisible();
  });

  test('opens the settings screen and can go back', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await openNavigation(page);
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible();
  });

  test('opens the import screen', async ({ page }) => {
    await page.goto('./import');
    await expect(page.getByRole('heading', { name: 'Import Song' })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByRole('tab', { name: /paste \/ drop/i })).toBeVisible();
  });
});

test.describe('Chorde E2E - Song Viewer', () => {
  test('opens a song and shows its title', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();

    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Back to library' })).toBeVisible();
  });

  test('transposes the song and shows the new key', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    const keyChip = page.locator('.MuiChip-label').filter({ hasText: /^Key / }).first();
    await expect(keyChip).toBeVisible();

    await page.getByRole('button', { name: 'Transpose up one semitone' }).click();
    await expect(page.getByRole('button', { name: 'Reset transposition' })).toBeVisible();
    await expect(keyChip).toHaveText(/from /);
  });

  test('offers the Nashville display mode', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Nashville' }).click();
    await expect(page.getByRole('button', { name: 'Nashville' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});

test.describe('Chorde E2E - Setlists', () => {
  test('creates a setlist from the navigation drawer', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    page.once('dialog', async (dialog) => {
      await dialog.accept('E2E Setlist');
    });

    await openNavigation(page);
    await page.getByRole('button', { name: 'Setlists' }).click();
    await page.getByRole('button', { name: 'New Setlist' }).click();

    await expect(page.getByText('E2E Setlist')).toBeVisible();
  });
});
