// Render page.html to entry.png with headless Chromium (Playwright).
// This VM only has the headless-shell build, so launch with the shell
// executable explicitly. Run from this directory: node render.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire('/home/hatch/workspace/makefun/gta6-tools/package.json');
const { chromium } = require('playwright');

const dir = dirname(fileURLToPath(import.meta.url));
const shellExe = '/home/hatch/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell';

const browser = await chromium.launch({ executablePath: shellExe });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto('file://' + join(dir, 'page.html'));
await page.waitForTimeout(400);
await page.screenshot({ path: join(dir, 'entry.png'), type: 'png' });
await browser.close();
console.log('rendered entry.png');
