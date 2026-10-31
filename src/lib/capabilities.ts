export type Tier = 'full' | 'lite' | 'static';

/** Decided once at startup. `?tier=full|lite|static` forces a tier for QA. */
export function detectTier(): Tier {
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced === 'full' || forced === 'lite' || forced === 'static') return forced;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const saveData = nav.connection?.saveData === true;
  let webgl = false;
  try {
    const canvas = document.createElement('canvas');
    webgl = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch { webgl = false; }
  if (reduceMotion || saveData || !webgl) return 'static';
  const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  const small = window.matchMedia('(max-width: 767px)').matches;
  return lowEnd || small ? 'lite' : 'full';
}
