import { continueRender, delayRender, staticFile, Easing, interpolate } from 'remotion';

export const COLORS = {
  night: '#071426', // bleu nuit profond
  electric: '#1677FF', // bleu électrique
  white: '#FFFFFF',
  mist: '#DCE5F0', // gris clair
  logoBg: '#00081C', // fond réel du fichier logo (coins)
};

export const FPS = 30;
export const DURATION_S = 21;

// ------------------------------------------------------------------ polices (chargées avant le rendu)
const FONTS: [string, string, string, string?][] = [
  ['Sora', 'Sora-500.ttf', '500'],
  ['Sora', 'Sora-600.ttf', '600'],
  ['Sora', 'Sora-700.ttf', '700'],
  ['Inter', 'Inter-400.ttf', '400'],
  ['Inter', 'Inter-500.ttf', '500'],
  ['Inter', 'Inter-600.ttf', '600'],
  ['Fraunces', 'Fraunces-300.ttf', '300'],
  ['Fraunces', 'Fraunces-400.ttf', '400'],
  ['Fraunces', 'Fraunces-500.ttf', '500'],
  ['Instrument Serif', 'InstrumentSerif-400.ttf', '400'],
  ['Instrument Serif', 'InstrumentSerif-400-italic.ttf', '400', 'italic'],
];
let fontsRequested = false;
export const loadFonts = () => {
  if (fontsRequested || typeof document === 'undefined') return;
  fontsRequested = true;
  const handle = delayRender('Chargement des polices');
  Promise.all(
    FONTS.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(`assets/fonts/${file}`)}) format('truetype')`, {
        weight,
        style: style ?? 'normal',
      });
      return face.load().then((f) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};

// ------------------------------------------------------------------ outils d'animation (temps en secondes)
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** progression 0→1 entre a et b, avec courbe */
export const prog = (t: number, a: number, b: number, ease: (x: number) => number = Easing.bezier(0.22, 1, 0.36, 1)) =>
  ease(clamp01((t - a) / (b - a)));
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const easeOutBack = Easing.bezier(0.34, 1.4, 0.64, 1);
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const range = (t: number, input: number[], output: number[]) =>
  interpolate(t, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
