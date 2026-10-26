import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flame } from '../brand/Logo'
import { useReveals } from '../motion/useReveals'
import { TIER } from '../lib/capabilities'
import './manifesto.css'

const WORDS: { w: string; hot?: boolean }[] = [
  { w: 'Si' },
  { w: 'tu' },
  { w: 'aimes' },
  { w: 'aujourd’hui,' },
  { w: 'tu' },
  { w: 'aimeras', hot: true },
  { w: 'demain\u00a0!', hot: true },
]

export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  useReveals(root)

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Les mots s'allument au rythme du défilement.
        gsap.fromTo(
          '.manifesto__word',
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: '.manifesto__quote', start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        )
        gsap.fromTo(
          '.manifesto__flame',
          { rotate: -20, scale: 0.6 },
          {
            rotate: 8,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="manifeste" className="manifesto" aria-labelledby="manifesto-title">
      <div className="container manifesto__grid">
        <div className="manifesto__text">
          <p className="eyebrow" data-reveal="up">
            La devise
          </p>
          <h2 id="manifesto-title" className="manifesto__quote display">
            {WORDS.map(({ w, hot }, i) => (
              <span key={i} className={`manifesto__word ${hot ? 'is-hot' : ''}`}>
                {w}{' '}
              </span>
            ))}
          </h2>
          <div className="manifesto__foot">
            <Flame className="manifesto__flame" />
            <p data-reveal="up">
              Du riz blanc, du poulet crousty et des sauces qui débordent du pot. Un bol simple, pensé pour qu’on y
              revienne. C’est écrit sur chaque pot.
            </p>
          </div>
        </div>
        <figure className="manifesto__media">
          <div className="manifesto__frame" data-reveal="clip">
            <img
              src="/media/photos/bols-alignes-1170.webp"
              srcSet="/media/photos/bols-alignes-640.webp 640w, /media/photos/bols-alignes-1170.webp 1170w"
              sizes="(min-width: 900px) 34vw, 90vw"
              width={1170}
              height={1542}
              loading="lazy"
              decoding="async"
              alt="Bols Thaisty Crousty alignés, nappés de sauce blanche et de sauce piquante, devant les sacs de livraison"
            />
          </div>
          <figcaption data-reveal="up">Sortie de cuisine · photo Thaisty Crousty</figcaption>
        </figure>
      </div>
    </section>
  )
}
