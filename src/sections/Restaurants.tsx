import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RESTAURANTS } from '../data/restaurants'
import { formatHour, isTodaySlot, openStatus, slotLabel } from '../lib/hours'
import { useReveals } from '../motion/useReveals'
import { PhoneIcon, PinIcon } from '../components/Icons'
import './restaurants.css'

export function Restaurants() {
  const root = useRef<HTMLElement>(null)
  const [now, setNow] = useState(() => new Date())
  const [onlyOpen, setOnlyOpen] = useState(false)
  useReveals(root)

  // Le statut « ouvert / fermé » se met à jour chaque minute.
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  const items = useMemo(() => RESTAURANTS.map((r) => ({ r, status: openStatus(r, now) })), [now])
  const openCount = items.filter((i) => i.status.open).length
  const shown = onlyOpen ? items.filter((i) => i.status.open) : items

  return (
    <section ref={root} id="restaurants" className="restos" aria-labelledby="restos-title">
      <div className="container">
        <header className="restos__head">
          <div>
            <p className="eyebrow" data-reveal="up">
              Les restaurants
            </p>
            <h2 id="restos-title" className="restos__title display" data-reveal="lines">
              Huit adresses
              <br />
              <span>à Alger.</span>
            </h2>
          </div>
          <div className="restos__filter" data-reveal="up">
            <p className="restos__live">
              <span className={`restos__dot ${openCount ? 'is-on' : ''}`} aria-hidden="true" />
              {openCount > 0
                ? `${openCount} restaurant${openCount > 1 ? 's' : ''} ouvert${openCount > 1 ? 's' : ''} en ce moment`
                : 'Tous les restaurants sont fermés en ce moment'}
            </p>
            <button type="button" className="restos__toggle" aria-pressed={onlyOpen} onClick={() => setOnlyOpen((v) => !v)} disabled={!openCount}>
              <span className="restos__switch" aria-hidden="true">
                <motion.span layout className="restos__knob" transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
              </span>
              Ouverts maintenant
            </button>
          </div>
        </header>

        <motion.ul className="restos__grid" layout>
          <AnimatePresence initial={false}>
            {shown.map(({ r, status }) => (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="resto"
              >
                <span className="resto__ghost display" aria-hidden="true">
                  {r.name}
                </span>
                <div className="resto__top">
                  <h3 className="resto__name">{r.name}</h3>
                  <span className={`resto__status ${status.open ? 'is-open' : ''}`}>{status.label}</span>
                </div>
                <dl className="resto__hours">
                  {r.slots.map((s) => (
                    <div key={slotLabel(s)} className={isTodaySlot(s, now) ? 'is-today' : ''}>
                      <dt>{slotLabel(s)}</dt>
                      <dd>
                        {formatHour(s.open)} – {formatHour(s.close)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="resto__address">{r.address ?? 'Adresse exacte à confirmer · voir l’itinéraire'}</p>
                <div className="resto__actions">
                  <a className="btn btn--red btn--small" href={`tel:${r.phone}`} aria-label={`Appeler Thaisty Crousty ${r.name} au ${r.phoneDisplay}`}>
                    <PhoneIcon />
                    {r.phoneDisplay}
                  </a>
                  <a className="btn btn--ghost btn--small" href={r.mapsUrl} target="_blank" rel="noreferrer">
                    <PinIcon />
                    Itinéraire
                  </a>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="restos__note">Horaires à l’heure d’Alger, tels qu’affichés par chaque restaurant.</p>
      </div>
    </section>
  )
}
