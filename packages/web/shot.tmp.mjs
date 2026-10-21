import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:5173/chorde/');
await page.waitForTimeout(2500);

await page.getByLabel('Group by').click();
await page.waitForTimeout(300);
await page.getByRole('option', { name: 'By artist' }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: '/var/folders/7r/75czf7515qs_7pyxb08wd91r0000gn/T/opencode/chorde-check/grouped.png' });

// And the missing details filter
await page.getByText('Missing details').click();
await page.waitForTimeout(600);
await page.screenshot({ path: '/var/folders/7r/75czf7515qs_7pyxb08wd91r0000gn/T/opencode/chorde-check/missing.png' });

console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
