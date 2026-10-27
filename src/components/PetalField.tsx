import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './PetalField.module.css';

interface PetalFieldProps {
  /** Densité relative (1 = valeur par défaut). */
  density?: number;
  opacity?: number;
  className?: string;
}

/** Nombre de pétales adapté à l'appareil (écran, processeur). */
function petalBudget(density: number) {
  const small = window.matchMedia('(max-width: 48rem)').matches;
  const modest = (navigator.hardwareConcurrency ?? 4) <= 4;
  const base = small ? 18 : 46;
  return Math.round(base * density * (modest ? 0.6 : 1));
}

/**
 * Rendu WebGL logiciel (sans carte graphique) : chaque image serait calculée
 * par le processeur et bloquerait la page. On s'abstient dans ce cas.
 */
function hasHardwareWebGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * Calque de pétales 3D. Three.js est chargé à la demande, après l'affichage
 * de la page ; rien n'est chargé si l'utilisateur préfère réduire les animations.
 */
export function PetalField({ density = 1, opacity = 0.92, className }: PetalFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = ref.current;
    if (reducedMotion || !container || !hasHardwareWebGL()) return;

    let disposed = false;
    let handle: { dispose: () => void } | null = null;

    const load = () =>
      import('../three/PetalScene')
        .then(({ createPetalScene }) => {
          if (disposed) return;
          const small = window.matchMedia('(max-width: 48rem)').matches;
          handle = createPetalScene(container, {
            count: petalBudget(density),
            maxPixelRatio: small ? 1.5 : 1.75,
            opacity,
          });
        })
        .catch(() => {
          /* échec de chargement : la page reste complète sans pétales */
        });

    // Chargement différé pour ne pas concurrencer le hero.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      handle?.dispose();
    };
  }, [density, opacity, reducedMotion]);

  return <div ref={ref} className={[styles.field, className].filter(Boolean).join(' ')} aria-hidden="true" />;
}
