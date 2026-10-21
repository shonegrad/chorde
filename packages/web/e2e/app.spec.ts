import { test, expect, type Page } from '@playwright/test';

/**
 * Click a control of a song, whether it is in the bar or in the menu.
 */
const clickSongControl = async (page: Page, name: string) => {
  await openMoreControls(page);

  const button = page.getByRole('button', { name, exact: true });
  if (await button.count()) {
    await button.click();
    return;
  }

  await page.getByRole('menuitem', { name, exact: true }).click();
};

/**
 * On a phone the controls of a song live in a menu, so it has to be opened
 * before the items inside it can be used. On a big screen there is no menu,
 * so this does nothing.
 */
const openMoreControls = async (page: Page) => {
  const more = page.getByRole('button', { name: 'More controls' });
  if (await more.isVisible()) {
    await more.click();
    await expect(page.getByRole('menu')).toBeVisible();
  }
};

/**
 * On narrow viewports the navigation lives behind a menu button, so it has to
 * be opened before the items inside it can be used.
 */
const openNavigation = async (page: Page) => {
  // On a big screen the navigation is always there, so there is nothing to open.
  const size = page.viewportSize();
  if (size && size.width >= 900) return;

  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  await menuButton.waitFor({ state: 'visible' });
  await menuButton.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeVisible();
};

test.describe('Chorde E2E - Song List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('shows the song list heading with a song count', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /songs/i });
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/Songs \(\d+\)/);
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
    await expect(page.getByRole('heading', { name: /songs/i })).not.toHaveText(
      new RegExp(`Songs \\(${before}\\)`)
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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Chord Library' }).first().click();

    await expect(page.getByRole('heading', { name: 'Chord Library' })).toBeVisible();
  });

  test('keeps the sidebar in view on a big screen', async ({ page }) => {
    // On a phone the sidebar is a drawer that slides in, so it is not in view.
    const size = page.viewportSize();
    test.skip(Boolean(size && size.width < 900), 'The sidebar is a drawer on a small screen.');

    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    const sidebar = page.getByRole('navigation', { name: 'Main' });
    await expect(sidebar).toBeVisible();

    await sidebar.getByRole('button', { name: 'Chords', exact: true }).click();
    await expect(page).toHaveURL(/\/chords/);
    await expect(page.getByRole('heading', { name: 'Chord Library' })).toBeVisible();

    // The sidebar is still there on the next screen.
    await expect(sidebar).toBeVisible();

    await sidebar.getByRole('button', { name: 'Settings', exact: true }).click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(sidebar).toBeVisible();
  });

  test('shows where you are in the sidebar', async ({ page }) => {
    const size = page.viewportSize();
    test.skip(Boolean(size && size.width < 900), 'The sidebar is a drawer on a small screen.');

    await page.goto('./chords');
    await expect(page.getByRole('heading', { name: 'Chord Library' })).toBeVisible({
      timeout: 15000,
    });

    const sidebar = page.getByRole('navigation', { name: 'Main' });
    await expect(sidebar.getByRole('button', { name: 'Chords', exact: true })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(sidebar.getByRole('button', { name: /^Songs \d+ songs?$/ })).not.toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  test('opens the settings screen and can go back', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await openNavigation(page);
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible();
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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();

    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Back to library' })).toBeVisible();
  });

  test('transposes the song and shows the new key', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    const keyChip = page.locator('.MuiChip-label').filter({ hasText: /^Key / }).first();
    await expect(keyChip).toBeVisible();

    await openMoreControls(page);
    await page.getByRole('button', { name: 'Transpose up one semitone' }).click();
    await expect(page.getByRole('button', { name: 'Reset transposition' })).toBeVisible();
    await expect(keyChip).toHaveText(/from /);
  });

  test('keeps the sidebar beside the song on a big screen', async ({ page }) => {
    // On a phone the sidebar is a drawer, so it is not beside the song.
    const size = page.viewportSize();
    test.skip(Boolean(size && size.width < 900), 'The sidebar is a drawer on a small screen.');

    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  });

  test('never scrolls the controls of a song sideways', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    // The controls wrap onto another row rather than hiding off the side.
    const overflow = await page.evaluate(() => {
      const bar = document.querySelector('.MuiAppBar-root');
      return bar ? bar.scrollWidth - bar.clientWidth : 0;
    });
    expect(overflow).toBe(0);
  });

  test('writes the chords out on a stave and in tablature', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    // The notes are written on a stave. On a phone the controls are in a menu.
    await openMoreControls(page);
    await page.getByRole('button', { name: 'Notes' }).click();

    const staves = page.locator('.song-line-art-chords svg');
    await expect(staves.first()).toBeVisible({ timeout: 20000 });

    // The clef and the key signature are only at the start of the song.
    await expect(staves.first().locator('.vf-clef')).toHaveCount(1);
    await expect(staves.nth(1).locator('.vf-clef')).toHaveCount(0);

    // And the shapes are written in tablature.
    await page.getByRole('button', { name: 'Tabs' }).click();
    const tabs = page.locator('.song-line-art-chords svg').first();
    await expect(tabs).toBeVisible();

    // The numbers break the strings themselves, so there is no shape hiding
    // behind them in the colour of the page.
    await expect(tabs.locator('.vf-tabnote rect')).toHaveCount(0);
  });

  test('offers the Nashville display mode', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await openMoreControls(page);
    await page.getByRole('button', { name: 'Nashville' }).click();
    await expect(page.getByRole('button', { name: 'Nashville' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});

test.describe('Chorde E2E - Chord reference', () => {
  test('shows a chord as a diagram, a tab and notes', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await page.locator('.chord-display').first().click();
    await expect(page.getByRole('group', { name: 'How the chord is written' })).toBeVisible();

    await page.getByRole('button', { name: 'Tab' }).click();
    await expect(page.getByRole('img', { name: /in tablature/i })).toBeVisible({ timeout: 20000 });

    await page.getByRole('button', { name: 'Notes' }).click();
    await expect(page.getByRole('img', { name: /on the stave/i })).toBeVisible();
  });
});

test.describe('Chorde E2E - Setlists', () => {
  test('creates a setlist from the navigation drawer', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    const favouriteButton = page.getByRole('button', { name: /^Favourite / }).first();
    const songName = (await favouriteButton.getAttribute('aria-label')) ?? '';
    await favouriteButton.click();

    await openNavigation(page);
    await page.getByRole('button', { name: /^Favourites/ }).click();

    await expect(page).toHaveURL(/favourite=true/);
    await expect(page.getByRole('heading', { name: /songs \(1\)/i })).toBeVisible();
    expect(songName).not.toBe('');
  });

  test('sorts the library by artist', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    const search = page.getByPlaceholder(/search songs, artists/i);
    await search.fill('wretch');
    await expect(page.getByRole('heading', { name: /songs \(0\)/i })).toBeVisible();

    await page.getByRole('button', { name: /titles and artists only/i }).click();
    await expect(page.getByRole('heading', { name: /songs \(1\)/i })).toBeVisible();
  });

  test('deletes songs in bulk', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    const heading = page.getByRole('heading', { name: /songs/i });
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

    await expect(heading).toContainText(`Songs (${before - 2})`);
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

    const titles = await page
      .getByRole('list', { name: 'Search results' })
      .getByRole('heading', { level: 6 })
      .allTextContents();
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

test.describe('Chorde E2E - Finding your way around the library', () => {
  test('shows the chords that fit a key', async ({ page }) => {
    await page.goto('./chords');
    await expect(page.getByRole('heading', { name: 'Chord Library' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByLabel('Key').click();
    await page.getByRole('option', { name: 'G', exact: true }).click();

    // The chords of G major, in the order they appear in the scale.
    await expect(page.getByText('G · I')).toBeVisible();
    await expect(page.getByText('Am · ii')).toBeVisible();
    await expect(page.getByText('F#dim · vii')).toBeVisible();
  });

  test('says what a chord is made of and where it sits in the key', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await page
      .getByRole('button', { name: /show chord diagram for G/i })
      .first()
      .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/1-3-5/)).toBeVisible();
  });
});

test.describe('Chorde E2E - Performing a setlist', () => {
  test('plays through a setlist', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    page.once('dialog', async (dialog) => {
      await dialog.accept('E2E Set');
    });

    await openNavigation(page);
    await page.getByRole('button', { name: 'Setlists' }).click();
    await page.getByRole('button', { name: 'New Setlist' }).click();

    await page.getByRole('button', { name: 'Add Song' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    const addButtons = dialog.getByRole('button', { name: /^Add / });
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('button', { name: 'Play', exact: true }).click();

    // The player opens on the first song.
    await expect(page.getByText('1 of 2')).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole('button', { name: /show chord diagram for/i }).first()
    ).toBeVisible();

    // And moves on to the next one.
    await page.getByRole('button', { name: 'Next song' }).click();
    await expect(page.getByText('2 of 2')).toBeVisible();
  });
});

test.describe('Chorde E2E - Writing desk', () => {
  test('writes a song and keeps it', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'New Song' }).click();
    await expect(page.getByRole('heading', { name: 'New Song' })).toBeVisible();

    await page.getByLabel('Title').fill('A Song of My Own');
    await page.getByLabel('Artist').fill('Me');

    const songBox = page.getByLabel('Song');
    await songBox.click();
    await songBox.type('[G]Hello there [C]my friend');

    // The editor saves on its own, so nothing is lost.
    await expect(page.getByText(/Saved at/)).toBeVisible({ timeout: 10000 });

    // And it ends up among your own songs.
    await page.goto('./');
    await openNavigation(page);
    await page.getByRole('button', { name: /^My Songs/ }).click();

    await expect(page.getByRole('heading', { name: 'A Song of My Own' })).toBeVisible();
  });

  test('offers the chords of the key first', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'New Song' }).click();
    await expect(page.getByRole('heading', { name: 'New Song' })).toBeVisible();

    await page.getByLabel('Key').click();
    await page.getByRole('option', { name: 'G', exact: true }).click();

    const palette = page.getByLabel('Chord palette');
    await expect(palette).toBeVisible();

    const chords = await palette.getByRole('button').allTextContents();
    expect(chords.slice(0, 3)).toEqual(['G', 'Am', 'Bm']);
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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    const skipLink = page.getByRole('link', { name: /skip to content/i });
    await skipLink.focus();
    await skipLink.press('Enter');

    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('transposes a song with the arrow keys', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

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
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await clickSongControl(page, 'Show keyboard shortcuts');
    await expect(page.getByRole('heading', { name: 'Keyboard shortcuts' })).toBeVisible();
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

test.describe('Chorde E2E - Sound', () => {
  /**
   * A stand-in for the Web Audio API, so the test can tell whether anything
   * was actually played.
   */
  const stubAudio = async (page: Page) => {
    await page.addInitScript(() => {
      const played: { frequency: number; type: string }[] = [];

      class FakeAudioParam {
        value = 0;
        setValueAtTime() {}
        linearRampToValueAtTime() {}
        exponentialRampToValueAtTime() {}
      }

      class FakeNode {
        connect() {
          return this;
        }
        disconnect() {}
      }

      class FakeOscillator extends FakeNode {
        type = 'sine';
        frequency = new FakeAudioParam();
        detune = new FakeAudioParam();
        onended: (() => void) | null = null;
        start() {
          played.push({ frequency: this.frequency.value, type: this.type });
        }
        stop() {}
      }

      class FakeGainNode extends FakeNode {
        gain = new FakeAudioParam();
      }

      class FakeFilterNode extends FakeNode {
        type = 'lowpass';
        frequency = new FakeAudioParam();
        Q = new FakeAudioParam();
      }

      class FakeCompressorNode extends FakeNode {
        threshold = new FakeAudioParam();
        knee = new FakeAudioParam();
        ratio = new FakeAudioParam();
        attack = new FakeAudioParam();
        release = new FakeAudioParam();
      }

      class FakeAudioContext {
        currentTime = 0;
        state = 'running';
        destination = new FakeNode();
        createOscillator() {
          return new FakeOscillator();
        }
        createGain() {
          return new FakeGainNode();
        }
        createBiquadFilter() {
          return new FakeFilterNode();
        }
        createDynamicsCompressor() {
          return new FakeCompressorNode();
        }
        resume = async () => undefined;
      }

      (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
      (window as unknown as { __played: typeof played }).__played = played;
    });
  };

  const playedNotes = (page: Page) =>
    page.evaluate(() => (window as unknown as { __played: unknown[] }).__played.length);

  test('plays the chords of the song being read', async ({ page }) => {
    await stubAudio(page);

    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await clickSongControl(page, 'Play the chords');

    await expect.poll(() => playedNotes(page)).toBeGreaterThan(0);
  });

  test('plays a chord from the chord diagram', async ({ page }) => {
    await stubAudio(page);

    await page.goto('./');
    await expect(page.getByRole('heading', { name: /songs/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('heading', { level: 2 }).first().click();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible({ timeout: 10000 });

    await page.getByText('C', { exact: true }).first().click();
    await page.getByRole('button', { name: 'Play this chord' }).click();

    await expect.poll(() => playedNotes(page)).toBeGreaterThan(0);
  });

  test('plays the scale of a key', async ({ page }) => {
    await stubAudio(page);

    await page.goto('./chords');
    await expect(page.getByRole('heading', { name: 'Chord Library' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /Play the scale of/ }).click();

    await expect.poll(() => playedNotes(page)).toBeGreaterThan(0);
  });

  test('changes the sound in the settings', async ({ page }) => {
    await stubAudio(page);

    await page.goto('./settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Play a sound' }).click();
    await expect.poll(() => playedNotes(page)).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'Pure' }).click();
    await page.getByRole('button', { name: 'Play a sound' }).click();

    // The pure tone is one oscillator for each note, rather than two.
    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { __played: { type: string }[] }).__played.filter(
              (note) => note.type === 'sine'
            ).length
        )
      )
      .toBeGreaterThan(0);
  });
});
