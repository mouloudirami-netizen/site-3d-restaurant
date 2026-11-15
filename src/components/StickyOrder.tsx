import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useOrder } from './orderContext'
import { PhoneIcon } from './Icons'
import './sticky-order.css'

/**
 * Bouton « Commander » toujours accessible sur téléphone et tablette (< 1024 px) :
 * il apparaît dès qu'on a quitté l'accueil et s'efface quand le grand bouton final est visible.
 * Sur ordinateur, la barre de navigation (qui contient déjà le bouton) reste affichée en permanence.
 */
export function StickyOrder() {
  const { openOrder } = useOrder()
  const [pastHero, setPastHero] = useState(false)
  const [finalVisible, setFinalVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const final = document.querySelector('.final__ctas')
    if (!final) return
    const io = new IntersectionObserver(([entry]) => setFinalVisible(entry.isIntersecting))
    io.observe(final)
    return () => io.disconnect()
  }, [])

  const show = pastHero && !finalVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="sticky-order"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          <button type="button" className="sticky-order__btn" onClick={openOrder}>
            <span className="sticky-order__icon" aria-hidden="true">
              <PhoneIcon />
            </span>
            <span className="sticky-order__label">
              Commander
              <small>Appel direct au restaurant</small>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
