import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:5173/chorde/');
await page.waitForTimeout(2500);

// Open a song, so that it is played
await page.getByText('Amazing Grace').first().click();
await page.waitForTimeout(1500);

// Mark it as a song we know
await page.getByRole('button', { name: /mark as a song you know/i }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: '/var/folders/7r/75czf7515qs_7pyxb08wd91r0000gn/T/opencode/chorde-check/known.png' });

// Back to the library, and the sidebar should know
await page.goto('http://localhost:5173/chorde/');
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /recently played/i }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: '/var/folders/7r/75czf7515qs_7pyxb08wd91r0000gn/T/opencode/chorde-check/played.png' });

console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
