import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SAUCE_COLORS, SAUCE_LABELS, type SauceKey } from '../data/menu'
import { TIER } from '../lib/capabilities'
import { useReveals } from '../motion/useReveals'
import './crunch.css'

const SAUCES: { key: SauceKey; note: string }[] = [
  { key: 'blanche', note: 'Maison. La base des Crousty.' },
  { key: 'curry', note: 'La base des Crousty Curry.' },
  { key: 'piquante', note: 'Pour les Spicy.' },
  { key: 'sucree', note: 'Pour les Sweet.' },
]

const PHOTOS = [
  { id: 'pluie-persil', alt: 'Persil qui tombe en pluie sur un bol nappé de sauce curry', speed: 0.12, cls: 'is-a' },
  { id: 'affiche-splash', alt: 'Affiche Thaisty Crousty : deux bols et des éclaboussures de sauce', speed: -0.1, cls: 'is-b' },
  { id: 'bol-kraft', alt: 'Bol Thaisty Crousty sauce blanche sur le plan de travail en inox', speed: 0.2, cls: 'is-c' },
]

export function Crunch() {
  const root = useRef<HTMLElement>(null)
  useReveals(root)

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.crunch__line--a',
          { xPercent: 6 },
          { xPercent: -18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        gsap.fromTo(
          '.crunch__line--b',
          { xPercent: -22 },
          { xPercent: 4, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="sauces" className="crunch" aria-labelledby="crunch-title">
      <h2 id="crunch-title" className="crunch__giant display" aria-label="Crousti et spicy">
        <span className="crunch__line crunch__line--a" aria-hidden="true">
          Crousti <em>&amp;</em> Spicy
        </span>
        <span className="crunch__line crunch__line--b halftone-text" aria-hidden="true">
          Ça déborde · Ça déborde
        </span>
      </h2>

      <div className="container crunch__grid">
        {PHOTOS.map((p) => (
          <figure key={p.id} className={`crunch__photo ${p.cls}`}>
            <div className="crunch__frame" data-reveal="clip">
              <img
                data-parallax={p.speed}
                src={`media/photos/${p.id}-1170.webp`}
                srcSet={`media/photos/${p.id}-640.webp 640w, media/photos/${p.id}-1170.webp 1170w`}
                sizes="(min-width: 900px) 30vw, 80vw"
                width={1170}
                height={1540}
                loading="lazy"
                decoding="async"
                alt={p.alt}
              />
            </div>
          </figure>
        ))}

        <div className="crunch__sauces">
          <p className="eyebrow" data-reveal="up">
            Les sauces
          </p>
          <p className="crunch__lead" data-reveal="up">
            Le croustillant, c’est le poulet. Le caractère, ce sont les sauces. Elles nappent, elles coulent, elles
            débordent du pot.
          </p>
          <ul>
            {SAUCES.map((s) => (
              <li key={s.key} data-reveal="up">
                <span className="crunch__drop" style={{ background: SAUCE_COLORS[s.key] }} aria-hidden="true" />
                <span className="crunch__sauce-name">{SAUCE_LABELS[s.key]}</span>
                <span className="crunch__sauce-note">{s.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
