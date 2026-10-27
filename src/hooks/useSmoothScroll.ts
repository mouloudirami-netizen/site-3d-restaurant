import Lenis from 'lenis';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '../lib/motion';

let instance: Lenis | null = null;

/** Instance active (null si le défilement fluide est désactivé). */
export const getLenis = () => instance;

/**
 * Défilement fluide (Lenis) synchronisé avec ScrollTrigger.
 * Désactivé si l'utilisateur préfère réduire les animations.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({ anchors: true, lerp: 0.1 });
    instance = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);
}
