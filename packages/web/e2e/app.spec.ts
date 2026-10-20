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

test.describe('Chorde E2E - Organising the library', () => {
  test('favourites a song and filters by favourites', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    const favouriteButton = page.getByRole('button', { name: /^Favourite / }).first();
    const songName = (await favouriteButton.getAttribute('aria-label')) ?? '';
    await favouriteButton.click();

    await openNavigation(page);
    await page.getByRole('button', { name: /^Favourites/ }).click();

    await expect(page).toHaveURL(/favourite=true/);
    await expect(page.getByRole('heading', { name: /my songs \(1\)/i })).toBeVisible();
    expect(songName).not.toBe('');
  });

  test('sorts the library by artist', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    const sortSelect = page.getByRole('combobox', { name: 'Sort by' });
    await sortSelect.click();
    const option = page.getByRole('option', { name: 'Artist (A-Z)' });
    await expect(option).toBeVisible();
    await option.click();
    await expect(sortSelect).toContainText('Artist (A-Z)');

    const artists = await page.locator('.MuiTypography-subtitle1').allTextContents();
    const sorted = [...artists].sort((a, b) => a.localeCompare(b));
    expect(artists).toEqual(sorted);
  });

  test('finds a song by its lyrics', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    const search = page.getByPlaceholder(/search songs, artists/i);
    await search.fill('wretch');
    await expect(page.getByRole('heading', { name: /my songs \(0\)/i })).toBeVisible();

    await page.getByRole('button', { name: /titles and artists only/i }).click();
    await expect(page.getByRole('heading', { name: /my songs \(1\)/i })).toBeVisible();
  });

  test('deletes songs in bulk', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    const heading = page.getByRole('heading', { name: /my songs/i });
    const before = Number((await heading.textContent())?.match(/\((\d+)\)/)?.[1] ?? '0');
    expect(before).toBeGreaterThan(2);

    await page.getByRole('button', { name: 'Select' }).click();
    await page
      .getByRole('checkbox', { name: /^Select / })
      .first()
      .check();
    await page
      .getByRole('checkbox', { name: /^Select / })
      .nth(1)
      .check();
    await expect(page.getByText('2 selected')).toBeVisible();

    await page.getByRole('button', { name: 'Delete', exact: true }).first().click();
    await page.getByRole('button', { name: 'Delete', exact: true }).last().click();

    await expect(heading).toContainText(`My Songs (${before - 2})`);
  });

  test('exports the library as a backup file', async ({ page }) => {
    await page.goto('./settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export library/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^chorde-library-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

test.describe('Chorde E2E - Online search', () => {
  test('finds the closest match first', async ({ page }) => {
    await page.goto('./import');
    await expect(page.getByRole('heading', { name: 'Import Song' })).toBeVisible({
      timeout: 15000,
    });

    const searchTab = page.getByRole('tab', { name: /search online/i });
    // Online search is only available in a development build.
    if (!(await searchTab.isVisible())) {
      test.skip(true, 'Online search is disabled in this build.');
      return;
    }

    await searchTab.click();
    await page.getByPlaceholder(/search for a song/i).fill('amazing grace');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(/results? found/)).toBeVisible({ timeout: 45000 });

    const titles = await page.getByRole('heading', { level: 6 }).allTextContents();
    expect(titles[0]).toBe('Amazing Grace');
  });

  test('shows the sources that can be searched', async ({ page }) => {
    await page.goto('./import');
    await expect(page.getByRole('heading', { name: 'Import Song' })).toBeVisible({
      timeout: 15000,
    });

    const searchTab = page.getByRole('tab', { name: /search online/i });
    if (!(await searchTab.isVisible())) {
      test.skip(true, 'Online search is disabled in this build.');
      return;
    }

    await searchTab.click();
    await expect(page.getByText('OpenHymnal')).toBeVisible({ timeout: 30000 });
  });
});

test.describe('Chorde E2E - Mobile', () => {
  test.use({ viewport: { width: 390, height: 780 } });

  test('keeps a bottom navigation bar on every screen', async ({ page }) => {
    await page.goto('./settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });

    const bottomNav = page.getByLabel('Main navigation');
    await expect(bottomNav).toBeVisible();

    await bottomNav.getByRole('button', { name: /import/i }).click();
    await expect(page).toHaveURL(/\/import/);
    await expect(bottomNav).toBeVisible();
  });

  test('leaves the song viewer full screen', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await expect(page.getByLabel('Main navigation')).toHaveCount(0);
  });
});

test.describe('Chorde E2E - Accessibility', () => {
  test('puts the skip link first, so a keyboard user reaches it straight away', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    const firstFocusable = await page.evaluate(() => {
      const focusable = document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return focusable[0]?.getAttribute('class') ?? '';
    });

    expect(firstFocusable).toContain('skip-link');
  });

  test('the skip link moves the focus to the content', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    const skipLink = page.getByRole('link', { name: /skip to content/i });
    await skipLink.focus();
    await skipLink.press('Enter');

    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('transposes a song with the arrow keys', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    const keyChip = page.locator('.MuiChip-label').filter({ hasText: /^Key / }).first();
    const before = await keyChip.textContent();

    await page.keyboard.press('ArrowRight');
    await expect(keyChip).not.toHaveText(before ?? '');
    await expect(keyChip).toHaveText(/from /);
  });

  test('shows the keyboard shortcuts', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /my songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: /show keyboard shortcuts/i }).click();
    await expect(page.getByText('Keyboard shortcuts')).toBeVisible();
    await expect(page.getByText('Transpose up a semitone')).toBeVisible();
  });

  test('switches between the light and dark themes', async ({ page }) => {
    await page.goto('./settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('remembers the chosen theme on the next visit', async ({ page }) => {
    await page.goto('./settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
