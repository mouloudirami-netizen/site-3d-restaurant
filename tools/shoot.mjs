// Screenshots of the page at several scroll positions (desktop and phone) for visual review.
// Usage: node tools/shoot.mjs <url> <outDir> [tier]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [url = 'http://localhost:5173', out = 'shots', tier = 'full'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
for (const vp of [{ name: 'desk', width: 1440, height: 900 }, { name: 'phone', width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${url}/?tier=${tier}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.ceil(H / vp.height);
  for (let i = 0; i < steps; i++) {
    const y = Math.min(i * vp.height, H - vp.height);
    await page.evaluate((y) => { window.scrollTo(0, y); }, y);
    await page.waitForTimeout(1600);
    process.stdout.write('.');
    await page.screenshot({ timeout: 120000, path: `${out}/${vp.name}-${String(i).padStart(2, '0')}.jpg`, quality: 70, type: 'jpeg' });
  }
  console.log(vp.name, 'height', H, 'shots', steps, errors.length ? 'errors: ' + errors.join(' | ') : 'no errors');
  await page.close();
}
await browser.close();
