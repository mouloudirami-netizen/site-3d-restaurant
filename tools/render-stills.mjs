// Renders still images of the 3D dish (static-tier fallback, footer close-up) from the running site.
// Usage: start `npm run dev` (or preview), then: node tools/render-stills.mjs http://localhost:5173 public/media
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const [base = 'http://localhost:5173', out = 'public/media'] = process.argv.slice(2);
const shots = [
  { name: 'plate-still', width: 1000, height: 1250, progress: 1, view: 'side' },
  { name: 'plate-close', width: 1000, height: 1000, progress: 1, view: 'close' },
  { name: 'plate-top', width: 1000, height: 1000, progress: 1, view: 'top' },
];
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
page.on('pageerror', (e) => console.error('[page]', e.message));
await page.goto(`${base}/?capture&tier=full`);
await page.waitForFunction(() => window.__plate && window.__plate.renderStill, null, { timeout: 60000 });
for (const s of shots) {
  const data = await page.evaluate((s) => window.__plate.renderStill(s), s);
  const file = `${out}/${s.name}.png`;
  writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  console.log('wrote', file);
}
await browser.close();
