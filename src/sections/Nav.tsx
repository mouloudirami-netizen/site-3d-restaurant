import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from '../brand/Logo'
import { useOrder } from '../components/orderContext'
import { PhoneIcon } from '../components/Icons'
import { lockScroll, scrollToTarget } from '../motion/lenis'
import './nav.css'

const LINKS = [
  { href: '#recette', label: 'La recette' },
  { href: '#menu', label: 'Menu' },
  { href: '#rituel', label: 'Le geste' },
  { href: '#desserts', label: 'Desserts' },
  { href: '#restaurants', label: 'Restaurants' },
]

export function Nav() {
  const { openOrder } = useOrder()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 400 && y > last + 2)
      if (y < last - 2) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lockScroll(menuOpen)
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    // Laisse le menu mobile se refermer avant de défiler.
    window.setTimeout(() => scrollToTarget(href), menuOpen ? 350 : 0)
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''}`}>
        <div className="nav__inner">
          <a className="nav__logo" href="#top" onClick={go('#top')} aria-label="Thaisty Crousty, retour en haut">
            <Logo />
          </a>
          <nav className="nav__links" aria-label="Navigation principale">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={go(l.href)}>
                <span data-text={l.label}>{l.label}</span>
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <button className="btn btn--red btn--small nav__cta" type="button" onClick={openOrder}>
              <PhoneIcon />
              Commander
            </button>
            <button
              className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-menu__motif motif" aria-hidden="true" />
            <nav className="mobile-menu__links" aria-label="Menu mobile">
              {LINKS.map((l, i) => (
                <div className="mobile-menu__line" key={l.href}>
                <motion.a
                  href={l.href}
                  onClick={go(l.href)}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '110%' }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mobile-menu__index">0{i + 1}</span>
                  {l.label}
                </motion.a>
                </div>
              ))}
            </nav>
            <motion.div
              className="mobile-menu__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className="btn btn--red"
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openOrder()
                }}
              >
                <PhoneIcon />
                Commander par téléphone
              </button>
              <p>Si tu aimes aujourd’hui, tu aimeras demain !</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
