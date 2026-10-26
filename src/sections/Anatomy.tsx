import { lazy, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'motion/react'
import { BOWLS, SAUCE_COLORS } from '../data/menu'
import { TIER } from '../lib/capabilities'
import { scrollState } from '../motion/scrollState'
import { scrollToTarget } from '../motion/lenis'
import { useReveals } from '../motion/useReveals'
import { CanvasGate } from '../three/CanvasGate'
import type { SauceSetup } from '../three/AnatomyScene'
import { ArrowIcon } from '../components/Icons'
import { SELECT_BOWL_EVENT } from '../lib/events'
import './anatomy.css'

const AnatomyScene = lazy(() => import('../three/AnatomyScene'))

// Les couches reprennent l'infographie « bol éclaté » de la marque.
const STEPS = [
  { n: '01', title: 'Riz blanc', note: 'Le fond du pot.' },
  { n: '02', title: 'Sauce blanche', note: 'Ou sauce curry, selon le bol.' },
  { n: '03', title: 'Poulet crousty', note: 'Pané, doré, croustillant.' },
  { n: '04', title: 'Les sauces', note: 'Piquante, sucrée… ou les deux.' },
  { n: '05', title: 'Oignons frits & persil', note: 'La touche finale.' },
]

const CHOICES = ['classic', 'spicy', 'sweet', 'mix', 'curry-thai', 'curry-mix'] as const

export function Anatomy() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(-1)
  const [choice, setChoice] = useState<(typeof CHOICES)[number]>('spicy')
  useReveals(root)

  const bowl = BOWLS.find((b) => b.id === choice)!
  const sauce: SauceSetup = useMemo(() => {
    const [base, ...rest] = bowl.sauces
    return { base, drizzles: [base, ...rest] }
  }, [bowl])

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' },
        (ctx) => {
          const { motion: ok, desktop } = ctx.conditions as { motion: boolean; desktop: boolean }
          if (!ok) return
          gsap.to({}, {
            scrollTrigger: {
              trigger: '.anatomy__pin',
              start: 'top top',
              end: desktop ? '+=260%' : '+=220%',
              pin: true,
              anticipatePin: 1,
              scrub: true,
              onUpdate: (self) => {
                scrollState.anatomyProgress = self.progress
                // Couche « en cours » = la dernière dont la descente a commencé.
                const s = Math.min(STEPS.length - 1, Math.floor((self.progress - 0.08) / 0.16))
                setStep(self.progress < 0.08 ? -1 : self.progress > 0.92 ? STEPS.length : s)
              },
            },
          })
        },
      )
    },
    { scope: root },
  )

  const done = step >= STEPS.length || TIER === 'static'

  return (
    <section ref={root} id="recette" className="anatomy" aria-labelledby="anatomy-title">
      <div className="anatomy__pin">
        <div className="anatomy__bg motif" aria-hidden="true" />

        <CanvasGate
          className="anatomy__canvas"
          fallback={
            <img
              className="anatomy__fallback"
              src="/media/photos/eclate-1170.webp"
              width={1170}
              height={1552}
              loading="lazy"
              alt=""
            />
          }
        >
          {({ active }) => <AnatomyScene active={active} sauce={sauce} />}
        </CanvasGate>

        <div className="anatomy__ui container">
          <header className="anatomy__head">
            <p className="eyebrow" data-reveal="up">
              La recette
            </p>
            <h2 id="anatomy-title" className="anatomy__title display" data-reveal="lines">
              Cinq couches.
              <br />
              <span>Un seul bol.</span>
            </h2>
          </header>

          <ol className="anatomy__steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className={`anatomy__step ${i === step ? 'is-current' : ''} ${i < step || done ? 'is-done' : ''}`}>
                <span className="anatomy__step-n">{s.n}</span>
                <span className="anatomy__step-body">
                  <span className="anatomy__step-title">{s.title}</span>
                  <span className="anatomy__step-note">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className={`anatomy__chooser ${done ? 'is-visible' : ''}`} aria-hidden={!done}>
            <p className="anatomy__chooser-label">Choisis ta sauce</p>
            <div className="anatomy__chips" role="radiogroup" aria-label="Choix du bol">
              {CHOICES.map((id) => {
                const b = BOWLS.find((x) => x.id === id)!
                const selected = id === choice
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={done ? 0 : -1}
                    className={`anatomy__chip ${selected ? 'is-selected' : ''}`}
                    onClick={() => setChoice(id)}
                  >
                    <span className="anatomy__swatches" aria-hidden="true">
                      {b.sauces.map((s) => (
                        <i key={s} style={{ background: SAUCE_COLORS[s] }} />
                      ))}
                    </span>
                    {b.family === 'curry' ? `Curry ${b.name}` : b.name}
                    {selected && <motion.span layoutId="chip-bg" className="anatomy__chip-bg" />}
                  </button>
                )
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.button
                key={choice}
                type="button"
                className="anatomy__cta"
                tabIndex={done ? 0 : -1}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent(SELECT_BOWL_EVENT, { detail: choice }))
                  scrollToTarget('#menu')
                }}
              >
                Voir le {bowl.kicker} {bowl.name} au menu
                <ArrowIcon />
              </motion.button>
            </AnimatePresence>
          </div>
        </div>

        <p className="anatomy__note" aria-hidden="true">
          Modèle 3D illustratif · d’après le visuel « bol éclaté » de la marque
        </p>
      </div>
    </section>
  )
}
