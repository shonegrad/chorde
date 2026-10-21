import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:5173/chorde/song/new');
await page.waitForTimeout(2000);

const song = page.getByLabel('Song');
await song.fill('{start_of_verse}\n[C]Amazing [G]grace how [C]sweet the sound\n{start_of_chorus}\n[Am]How precious did that [D7]grace appear');
await page.waitForTimeout(800);
await page.screenshot({ path: '/var/folders/7r/75czf7515qs_7pyxb08wd91r0000gn/T/opencode/chorde-check/editor.png' });
console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
