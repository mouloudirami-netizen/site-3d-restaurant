import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { TIER } from '../lib/capabilities'
import { useReveals } from '../motion/useReveals'
import './recipe.css'

// Étape 0 = bol vide, puis une image par couche de la liste 01 → 05.
const FRAMES = [
  { alt: 'Le pot Thaisty Crousty vide' },
  { alt: 'Le riz blanc tombe dans le pot' },
  { alt: 'La sauce blanche nappe le riz' },
  { alt: 'Les morceaux de poulet crousty tombent sur la sauce' },
  { alt: 'Sauce piquante et sauce blanche versées sur le poulet' },
  { alt: 'Oignons frits et persil en pluie sur le bol terminé' },
]

const STEPS = [
  { n: '01', title: 'Riz blanc', note: 'Le fond du pot.' },
  { n: '02', title: 'Sauce blanche', note: 'Ou sauce curry, selon le bol.' },
  { n: '03', title: 'Poulet crousty', note: 'Pané, doré, croustillant.' },
  { n: '04', title: 'Les sauces', note: 'Piquante, sucrée… ou les deux.' },
  { n: '05', title: 'Oignons frits & persil', note: 'La touche finale.' },
]

const src = (i: number, w: 640 | 1024) => `media/recette/recette_etape${i}-${w}.webp`

// Chronologie (unités arbitraires) : l'étape 0 reste affichée un moment,
// puis chaque fondu dure FADE et commence toutes les 1 unité.
const LEAD = 0.5
const FADE = 0.4
const TOTAL = LEAD + STEPS.length * 1 + 0.1
// L'étape est considérée « active » au milieu de son fondu.
const stepAt = (t: number) => Math.max(0, Math.min(STEPS.length, Math.floor(t - LEAD - FADE / 2) + 1))

export function Recipe() {
  const root = useRef<HTMLElement>(null)
  // Sans animation, la dernière photo et toutes les étapes sont affichées d'emblée.
  const [step, setStep] = useState(() =>
    TIER === 'static' || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? STEPS.length : 0,
  )
  useReveals(root)

  // Précharge et décode les 6 images à l'approche de la section, à la taille adaptée à l'écran.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const w = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) > 900 ? 1024 : 640
        FRAMES.forEach((_, i) => {
          const img = new Image()
          img.decoding = 'async'
          img.src = src(i, w)
          img.decode?.().catch(() => {})
        })
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const frames = gsap.utils.toArray<HTMLElement>('.recipe__frame')
        const imgs = frames.map((f) => f.querySelector('img'))
        gsap.set(frames.slice(1), { autoAlpha: 0 })

        // La zone image est collante en CSS (position: sticky, fiable sur iOS) ;
        // ScrollTrigger ne fait que piloter les fondus sur toute la hauteur de la section.
        root.current?.classList.add('is-scrubbed')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setStep(stepAt(self.progress * TOTAL)),
          },
        })

        // Léger zoom (1 → 1.03) sur chaque image pendant qu'elle est à l'écran.
        imgs.forEach((img, i) => {
          if (!img) return
          const start = i === 0 ? 0 : LEAD + (i - 1)
          const end = i === STEPS.length ? TOTAL : LEAD + i + FADE
          tl.fromTo(img, { scale: 1 }, { scale: 1.03, duration: end - start }, start)
        })
        // Fondus enchaînés : chaque image se pose au-dessus de la précédente.
        frames.slice(1).forEach((frame, i) => {
          tl.to(frame, { autoAlpha: 1, duration: FADE }, LEAD + i)
        })
        tl.set({}, {}, TOTAL)
        return () => root.current?.classList.remove('is-scrubbed')
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="recette" className="recipe" aria-labelledby="recipe-title">
      <div className="recipe__pin">
        <div className="recipe__media">
          <div className="recipe__stack">
            {FRAMES.map((f, i) => (
              <figure key={i} className={`recipe__frame ${TIER === 'static' && i !== STEPS.length ? 'is-hidden' : ''}`}>
                <img
                  src={src(i, 1024)}
                  srcSet={`${src(i, 640)} 640w, ${src(i, 1024)} 1024w`}
                  sizes="(min-width: 900px) 50vw, 100vw"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  alt={f.alt}
                />
              </figure>
            ))}
          </div>
        </div>

        <div className="recipe__ui container">
          <header className="recipe__head">
            <p className="eyebrow" data-reveal="up">
              La recette
            </p>
            <h2 id="recipe-title" className="recipe__title display" data-reveal="lines">
              Cinq couches.
              <br />
              <span>Un seul bol.</span>
            </h2>
          </header>

          <ol className="recipe__steps">
            {STEPS.map((s, i) => {
              const n = i + 1
              return (
                <li
                  key={s.n}
                  className={`recipe__step ${n === step ? 'is-current' : ''} ${n < step ? 'is-done' : ''}`}
                  aria-current={n === step ? 'step' : undefined}
                >
                  <span className="recipe__step-n">{s.n}</span>
                  <span className="recipe__step-body">
                    <span className="recipe__step-title">{s.title}</span>
                    <span className="recipe__step-note">{s.note}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
