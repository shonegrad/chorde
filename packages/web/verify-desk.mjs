import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1100 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 150)); });

await page.goto('http://localhost:5173/chorde/');
await page.getByRole('heading', { name: /my songs/i }).waitFor({ timeout: 30000 });

// Open the editor for a new song
await page.getByRole('button', { name: 'New Song' }).click();
await page.getByRole('heading', { name: 'New Song' }).waitFor();

console.log('editor open ✓');

// Metadata
await page.getByLabel('Title').fill('My Own Song');
await page.getByLabel('Artist').fill('Me');
await page.getByLabel('Key').click();
await page.getByRole('option', { name: 'G', exact: true }).click();
await page.getByRole('spinbutton', { name: 'Tempo', exact: true }).fill('96');
await page.getByLabel('Capo').fill('2');

// Type lyrics with a chord
const songBox = page.getByLabel('Song');
await songBox.click();
await songBox.type('[G]Hello there [C]my friend');

// The chord palette offers the chords of the key first
await page.waitForTimeout(400);
const palette = await page.locator('.MuiChip-root').allTextContents();
console.log('palette starts with:', palette.slice(0, 8).join(', '));

// Insert a chord from the palette
await page.getByRole('button', { name: 'Am', exact: true }).first().click().catch(() => {});
await page.waitForTimeout(200);

// The autosave should kick in
await page.waitForTimeout(2000);
console.log('save status:', await page.locator('text=/Saved at|Not saved yet|Saving/').first().textContent());

await page.screenshot({ path: '/tmp/desk.png' });
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
