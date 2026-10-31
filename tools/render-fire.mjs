// Renders tools/fire.html frame by frame with headless Chromium, then the frames are encoded with ffmpeg.
// Usage: node tools/render-fire.mjs <outDir> [w] [h] [frames] [fps] [mode] [startTime]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const [out = 'tmp-frames', w = '900', h = '1125', frames = '240', fps = '30', mode = '0', start = '0'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const url = pathToFileURL(resolve('tools/fire.html')).href + `?w=${w}&h=${h}&mode=${mode}&loop=${+frames / +fps}`;
page.on('pageerror', (e) => console.error('[page]', e.message));
await page.goto(url);
await page.waitForFunction(() => window.ready === true);
const t0 = Date.now();
for (let i = 0; i < +frames; i++) {
  const t = +start + i / +fps;
  const data = await page.evaluate((t) => window.renderFrame(t), t);
  writeFileSync(`${out}/f${String(i).padStart(4, '0')}.png`, Buffer.from(data.split(',')[1], 'base64'));
  if (i === 0) console.log(`first frame ${Date.now() - t0} ms`);
}
console.log(`done ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
await browser.close();
