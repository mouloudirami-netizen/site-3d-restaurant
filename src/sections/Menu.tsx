import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BOWLS, EXTRAS, FAMILIES, SAUCE_COLORS, SAUCE_LABELS, type Bowl } from '../data/menu'
import { SELECT_BOWL_EVENT } from '../lib/events'
import { useReveals } from '../motion/useReveals'
import { PriceSlot } from '../components/PriceSlot'
import { useOrder } from '../components/orderContext'
import { PhoneIcon } from '../components/Icons'
import './menu.css'

type FamilyId = (typeof FAMILIES)[number]['id']

const EASE = [0.16, 1, 0.3, 1] as const

function Swatches({ bowl }: { bowl: Bowl }) {
  return (
    <span className="menu-swatches" aria-hidden="true">
      {bowl.sauces.map((s) => (
        <i key={s} style={{ background: SAUCE_COLORS[s] }} title={SAUCE_LABELS[s]} />
      ))}
    </span>
  )
}

function BowlImage({ bowl, sizes, eager = false }: { bowl: Bowl; sizes: string; eager?: boolean }) {
  return (
    <img
      src={`${bowl.image}-1000.webp`}
      srcSet={`${bowl.image}-560.webp 560w, ${bowl.image}-1000.webp 987w`}
      sizes={sizes}
      width={987}
      height={765}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      alt={`${bowl.kicker} ${bowl.name} : ${bowl.composition.join(', ').toLowerCase()}`}
    />
  )
}

export function Menu() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [family, setFamily] = useState<FamilyId>('crousty')
  const [activeId, setActiveId] = useState('spicy')
  const { openOrder } = useOrder()
  useReveals(root)

  const list = BOWLS.filter((b) => b.family === family)
  const active = list.find((b) => b.id === activeId) ?? list[0]

  // Un autre bloc (la recette 3D) peut demander d'afficher un bol précis.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const bowl = BOWLS.find((b) => b.id === id)
      if (!bowl) return
      setFamily(bowl.family)
      setActiveId(bowl.id)
      window.setTimeout(() => {
        track.current?.querySelector<HTMLElement>(`[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }, 500)
    }
    window.addEventListener(SELECT_BOWL_EVENT, onSelect)
    return () => window.removeEventListener(SELECT_BOWL_EVENT, onSelect)
  }, [])

  const switchFamily = (id: FamilyId) => {
    setFamily(id)
    const first = BOWLS.find((b) => b.family === id)!
    setActiveId(id === 'crousty' ? 'spicy' : first.id)
    track.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }

  return (
    <section ref={root} id="menu" className="menu" aria-labelledby="menu-title">
      <div className="menu__bg-word display outline-text" aria-hidden="true">
        Menu
      </div>
      <div className="container">
        <header className="menu__head">
          <div>
            <p className="eyebrow" data-reveal="up">
              Le menu
            </p>
            <h2 id="menu-title" className="menu__title display" data-reveal="lines">
              Huit bols.
              <br />
              <span>Deux bases.</span>
            </h2>
          </div>
          <div className="menu__switch" role="tablist" aria-label="Base du bol" data-reveal="up">
            {FAMILIES.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={family === f.id}
                className={`menu__switch-btn ${family === f.id ? 'is-active' : ''}`}
                onClick={() => switchFamily(f.id)}
              >
                {family === f.id && (
                  <motion.span layoutId="family-pill" className="menu__switch-pill" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
                )}
                <span className="menu__switch-label">{f.label}</span>
                <span className="menu__switch-note">{f.note}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Ordinateur : scène produit + liste éditoriale */}
        <div className="menu__desk">
          <div className="menu__stage" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.id}
                className="menu__stage-type"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: EASE }}
                aria-hidden="true"
              >
                <span className="spaced">{active.kicker}</span>
                <span className="menu__stage-name poster">{active.name}</span>
              </motion.div>
            </AnimatePresence>
            <div className="menu__stage-glow" aria-hidden="true" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.id}
                className="menu__stage-img"
                initial={{ opacity: 0, y: 80, rotate: -7, scale: 0.86 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, rotate: 5, scale: 0.92 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <BowlImage bowl={active} sizes="(min-width: 900px) 46vw, 90vw" />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="menu__stage-info"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className="menu__tagline">{active.tagline}</p>
                <ul className="menu__compo" aria-label="Composition">
                  {active.composition.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="menu__list">
            <ol>
              {list.map((b, i) => {
                const isActive = b.id === active.id
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      className={`menu-row ${isActive ? 'is-active' : ''}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveId(b.id)}
                      onMouseEnter={() => setActiveId(b.id)}
                      onFocus={() => setActiveId(b.id)}
                    >
                      {isActive && <motion.span layoutId="row-bar" className="menu-row__bar" transition={{ type: 'spring', stiffness: 400, damping: 36 }} />}
                      <span className="menu-row__n">0{i + 1}</span>
                      <span className="menu-row__main">
                        <span className="menu-row__kicker">{b.kicker}</span>
                        <span className="menu-row__name">{b.name}</span>
                      </span>
                      <Swatches bowl={b} />
                      <PriceSlot price={b.price} className="menu-row__price" />
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="menu__extras">
              <p className="menu__extras-title">Suppléments</p>
              <ul>
                {EXTRAS.map((x) => (
                  <li key={x.id}>
                    <span>{x.name}</span>
                    <PriceSlot price={x.price} />
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="btn btn--red menu__order" onClick={openOrder}>
              <PhoneIcon />
              Commander ce bol
            </button>
          </div>
        </div>
      </div>

      {/* Mobile et tablette : cartes à faire glisser */}
      <div className="menu__mobile">
        <div ref={track} className="menu__track" role="list" aria-label={`Bols ${FAMILIES.find((f) => f.id === family)!.label}`}>
          {list.map((b) => (
            <motion.article
              key={b.id}
              data-id={b.id}
              role="listitem"
              className={`menu-card ${b.id === activeId ? 'is-active' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="menu-card__type" aria-hidden="true">
                <span className="spaced">{b.kicker}</span>
                <span className="poster">{b.name}</span>
              </div>
              <div className="menu-card__img">
                <BowlImage bowl={b} sizes="80vw" />
              </div>
              <div className="menu-card__body">
                <h3 className="menu-card__name">
                  {b.kicker} <strong>{b.name}</strong>
                </h3>
                <p className="menu-card__compo">{b.composition.join(' · ')}</p>
                <div className="menu-card__foot">
                  <Swatches bowl={b} />
                  <PriceSlot price={b.price} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="container menu__mobile-foot">
          <div className="menu__extras">
            <p className="menu__extras-title">Suppléments</p>
            <ul>
              {EXTRAS.map((x) => (
                <li key={x.id}>
                  <span>{x.name}</span>
                  <PriceSlot price={x.price} />
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="btn btn--red" onClick={openOrder}>
            <PhoneIcon />
            Commander
          </button>
        </div>
      </div>
    </section>
  )
}
