import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { TIER } from '../lib/capabilities'

/**
 * Révélations déclaratives à l'intérieur d'une section :
 * - data-reveal="lines"  → titres découpés en lignes masquées
 * - data-reveal="up"     → montée + fondu (data-delay facultatif)
 * - data-reveal="clip"   → image révélée par un masque vertical
 * - data-parallax="0.15" → décalage vertical lié au défilement
 * Le contenu reste visible par défaut : GSAP n'applique l'état caché que si l'animation est autorisée.
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = scope.current
        if (!root) return

        root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            linesClass: 'split-line',
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 110,
                rotate: 2,
                duration: 1.15,
                ease: 'expo.out',
                stagger: 0.09,
                delay: Number(el.dataset.delay ?? 0),
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              })
            },
          })
        })

        ScrollTrigger.batch(root.querySelectorAll<HTMLElement>('[data-reveal="up"]'), {
          start: 'top 90%',
          once: true,
          onEnter: (els) =>
            gsap.from(els, {
              y: 48,
              autoAlpha: 0,
              duration: 1,
              ease: 'power3.out',
              stagger: 0.08,
              delay: Number((els[0] as HTMLElement).dataset.delay ?? 0),
            }),
        })

        root.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
          gsap.from(el, {
            clipPath: 'inset(100% 0% 0% 0% round 24px)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
          const img = el.querySelector('img')
          if (img) {
            gsap.from(img, {
              scale: 1.25,
              duration: 1.8,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            })
          }
        })

        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 0.15
          gsap.fromTo(
            el,
            { yPercent: amount * 100 },
            {
              yPercent: -amount * 100,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    },
    { scope },
  )
}
