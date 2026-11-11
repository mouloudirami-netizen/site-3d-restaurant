// Captures de contrôle : node production/stills.mjs 30,120,300 (numéros d'images)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const frames = (process.argv[2] || '0').split(',').map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const composition = await selectComposition({ serveUrl, id: 'SkynetPromo', browserExecutable });
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: f, output: path.join(root, `production/controle/f${String(f).padStart(3, '0')}.png`), browserExecutable });
}
console.log('ok', frames.length);
