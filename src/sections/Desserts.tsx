import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DESSERTS, DESSERT_RANGES } from '../data/desserts'
import { useReveals } from '../motion/useReveals'
import { PriceSlot } from '../components/PriceSlot'
import { ArrowIcon } from '../components/Icons'
import './desserts.css'

type RangeId = (typeof DESSERT_RANGES)[number]['id']
const EASE = [0.16, 1, 0.3, 1] as const

export function Desserts() {
  const root = useRef<HTMLElement>(null)
  const [range, setRange] = useState<RangeId>('creme')
  const [index, setIndex] = useState(1)
  const [dir, setDir] = useState(1)
  useReveals(root)

  const list = DESSERTS.filter((d) => d.range === range)
  const current = list[Math.min(index, list.length - 1)]
  const rangeInfo = DESSERT_RANGES.find((r) => r.id === range)!

  const go = (next: number) => {
    setDir(next > index ? 1 : -1)
    setIndex((next + list.length) % list.length)
  }

  return (
    <section
      ref={root}
      id="desserts"
      className="desserts"
      aria-labelledby="desserts-title"
      style={{ '--d-color': current.color, '--d-ink': current.ink } as React.CSSProperties}
    >
      <div className="desserts__wash" aria-hidden="true" />
      <div className="desserts__motif desserts__motif--a motif" aria-hidden="true" />
      <div className="desserts__motif desserts__motif--b motif" aria-hidden="true" />

      <div className="container desserts__inner">
        <header className="desserts__head">
          <p className="eyebrow desserts__eyebrow" data-reveal="up">
            Thaisty Sweety
          </p>
          <h2 id="desserts-title" className="desserts__title display" data-reveal="lines">
            Et pour finir,
            <br />
            <span>le sucré.</span>
          </h2>
          <div className="desserts__tabs" role="tablist" aria-label="Gamme de desserts" data-reveal="up">
            {DESSERT_RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={range === r.id}
                className={`desserts__tab ${range === r.id ? 'is-active' : ''}`}
                onClick={() => {
                  setRange(r.id)
                  setIndex(0)
                  setDir(1)
                }}
              >
                {r.label}
                <span className="desserts__tab-count">{DESSERTS.filter((d) => d.range === r.id).length}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="desserts__stage" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={current.id + '-type'}
              className="desserts__type"
              custom={dir}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="spaced">{rangeInfo.spaced}</span>
              <span className="desserts__name poster">{current.name}</span>
              {current.sub && <span className="desserts__sub poster">{current.sub}</span>}
            </motion.div>
          </AnimatePresence>

          <div className="desserts__jar-wrap">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.img
                key={current.id}
                className="desserts__jar"
                src={`media/desserts/${current.id}-720.webp`}
                srcSet={`media/desserts/${current.id}-400.webp 400w, media/desserts/${current.id}-720.webp 720w`}
                sizes="(min-width: 900px) 30vw, 62vw"
                alt={`${rangeInfo.label} ${current.name}${current.sub ? ' ' + current.sub : ''}, pot Thaisty Sweety`}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 120, rotate: d * 10, scale: 0.85 }),
                  center: { opacity: 1, x: 0, rotate: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -120, rotate: d * -8, scale: 0.85 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: EASE }}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </AnimatePresence>
            <div className="desserts__jar-shadow" aria-hidden="true" />
          </div>

          <div className="desserts__meta">
            <button type="button" className="desserts__arrow" onClick={() => go(index - 1)} aria-label="Dessert précédent">
              <ArrowIcon />
            </button>
            <div className="desserts__meta-info">
              <span>{current.weight ?? rangeInfo.label}</span>
              <PriceSlot price={current.price} />
            </div>
            <button type="button" className="desserts__arrow is-next" onClick={() => go(index + 1)} aria-label="Dessert suivant">
              <ArrowIcon />
            </button>
          </div>
        </div>

        <ul className="desserts__list" aria-label={`${rangeInfo.label} : saveurs`}>
          {list.map((d, i) => (
            <li key={d.id}>
              <button
                type="button"
                className={`desserts__pill ${d.id === current.id ? 'is-active' : ''}`}
                aria-pressed={d.id === current.id}
                onClick={() => go(i)}
              >
                <i style={{ background: d.color }} aria-hidden="true" />
                {d.name}
                {d.sub ? ` ${d.sub}` : ''}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
