import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://localhost:5173/chorde/chords');
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /create custom chord/i }).click();
await page.waitForTimeout(500);
await page.getByLabel('The chord').fill('Fmaj7');
await page.waitForTimeout(200);
const svg = page.locator('svg').last();
const box = await svg.boundingBox();
// The cells sit at (40 + string*30, 30 + row*40 + 20)
for (const [string, row] of [[2, 0], [3, 0], [4, 0], [4, 1], [4, 2]]) {
  await page.mouse.click(box.x + 40 + string * 30, box.y + 30 + row * 40 + 20);
}
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(800);

await page.reload();
await page.waitForTimeout(2000);
await page.getByPlaceholder(/search chords/i).fill('Fmaj7');
await page.waitForTimeout(600);
await page.screenshot({ path: '/var/folders/7r/75czf7515qs_7pyxb08wd91r0000gn/T/opencode/chorde-check/custom.png' });

console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
