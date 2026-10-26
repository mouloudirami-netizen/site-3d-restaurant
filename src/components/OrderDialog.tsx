import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RESTAURANTS } from '../data/restaurants'
import { openStatus } from '../lib/hours'
import { CloseIcon, PhoneIcon } from './Icons'
import { Flame } from '../brand/Logo'
import { lockScroll } from '../motion/lenis'
import { OrderContext } from './orderContext'
import './order-dialog.css'


export function OrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openOrder = useCallback(() => setOpen(true), [])
  const value = useMemo(() => ({ openOrder }), [openOrder])
  return (
    <OrderContext.Provider value={value}>
      {children}
      <OrderDialog open={open} onClose={() => setOpen(false)} />
    </OrderContext.Provider>
  )
}

function OrderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      setNow(new Date())
      dialog.showModal()
      lockScroll(true)
    }
    if (!open && dialog.open) {
      // Laisse l'animation de sortie se jouer avant de fermer réellement.
      const t = window.setTimeout(() => dialog.close(), 380)
      lockScroll(false)
      return () => window.clearTimeout(t)
    }
  }, [open])

  const list = useMemo(
    () =>
      RESTAURANTS.map((r) => ({ r, status: openStatus(r, now) })).sort(
        (a, b) => Number(b.status.open) - Number(a.status.open),
      ),
    [now],
  )

  return (
    <dialog
      ref={ref}
      className="order-dialog"
      aria-labelledby="order-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="order-dialog__panel"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <header className="order-dialog__head">
              <div>
                <p className="eyebrow">Commande par téléphone</p>
                <h2 id="order-title" className="order-dialog__title display">
                  Appelle ton <span className="order-dialog__accent">Thaisty</span>
                </h2>
              </div>
              <button className="order-dialog__close" type="button" onClick={onClose} aria-label="Fermer">
                <CloseIcon />
              </button>
            </header>
            <p className="order-dialog__intro">
              Choisis le restaurant le plus proche : l’appel se lance directement depuis ton téléphone.
            </p>
            <ul className="order-dialog__list">
              {list.map(({ r, status }, i) => (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.035, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a className="order-row" href={`tel:${r.phone}`}>
                    <span className="order-row__name">
                      <Flame className="order-row__flame" color={status.open ? 'var(--orange)' : 'rgba(244,239,230,.25)'} />
                      {r.name}
                    </span>
                    <span className={`order-row__status ${status.open ? 'is-open' : ''}`}>{status.label}</span>
                    <span className="order-row__phone">
                      <PhoneIcon />
                      {r.phoneDisplay}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
