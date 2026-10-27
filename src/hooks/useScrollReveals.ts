import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';

/**
 * Animations de révélation déclaratives, pilotées par des attributs :
 * - data-animate="fade-up"  : apparition douce par le bas (groupée par lots) ;
 * - data-animate="curtain"  : image dévoilée comme un rideau, avec léger dézoom ;
 * - data-parallax="0.15"    : décalage vertical lié au défilement (amplitude relative).
 * Sans animation (mouvement réduit), le contenu reste simplement visible.
 */
export function useScrollReveals(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      gsap.set('[data-animate="fade-up"]', { y: 40, opacity: 0 });
      ScrollTrigger.batch('[data-animate="fade-up"]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>('[data-animate="curtain"]').forEach((el) => {
        const img = el.querySelector('img');
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
          .fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
          )
          .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1);
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax) || 0.1;
        gsap.fromTo(
          el,
          { yPercent: amount * 100 },
          {
            yPercent: -amount * 100,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [enabled]);
}
