import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import styles from './Cursor.module.css';

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], input, label';

/**
 * Curseur d'accompagnement (ordinateur uniquement) : un point rose suit le
 * curseur natif, qui reste visible. Il s'agrandit sur les éléments
 * interactifs. Les éléments [data-magnetic] attirent légèrement le pointeur.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const mm = gsap.matchMedia();

    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        dot.dataset.visible = 'true';
        xTo(event.clientX);
        yTo(event.clientY);
        const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
        dot.dataset.active = target ? 'true' : 'false';
      };
      const onLeave = () => (dot.dataset.visible = 'false');

      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);

      // Effet magnétique, très discret
      const magnets = gsap.utils.toArray<HTMLElement>('[data-magnetic]');
      const cleanups = magnets.map((el) => {
        const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          mx((event.clientX - (rect.left + rect.width / 2)) * 0.18);
          my((event.clientY - (rect.top + rect.height / 2)) * 0.25);
        };
        const reset = () => {
          mx(0);
          my(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', reset);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', reset);
          gsap.set(el, { x: 0, y: 0 });
        };
      });

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        cleanups.forEach((cleanup) => cleanup());
      };
    });

    return () => mm.revert();
  }, []);

  return <div ref={dotRef} className={styles.dot} aria-hidden="true" data-visible="false" />;
}
