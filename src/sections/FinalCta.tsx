import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Logo } from '../brand/Logo'
import { useOrder } from '../components/orderContext'
import { InstagramIcon, PhoneIcon } from '../components/Icons'
import { TIER } from '../lib/capabilities'
import { useReveals } from '../motion/useReveals'
import { scrollToTarget } from '../motion/lenis'
import './final.css'

const INSTAGRAM = 'https://www.instagram.com/thaisty.alger/'
const YEAR = new Date().getFullYear()

export function FinalCta() {
  const root = useRef<HTMLElement>(null)
  const { openOrder } = useOrder()
  useReveals(root)

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.final__bowl',
          { y: 120, rotate: -10, scale: 0.85 },
          {
            y: 0,
            rotate: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <>
      <section ref={root} className="final" aria-labelledby="final-title">
        <div className="final__motif motif" aria-hidden="true" />
        <div className="container final__inner">
          <h2 id="final-title" className="final__title display">
            <span data-reveal="lines">T’as faim ?</span>
            <span className="final__title-alt" data-reveal="lines" data-delay="0.1">
              On s’occupe du crousty.
            </span>
          </h2>
          <img
            className="final__bowl"
            src="media/bowls/curry-mix-1000.webp"
            srcSet="media/bowls/curry-mix-560.webp 560w, media/bowls/curry-mix-1000.webp 987w"
            sizes="(min-width: 900px) 40vw, 86vw"
            width={987}
            height={767}
            loading="lazy"
            decoding="async"
            alt="Bol Crousty Curry Mix"
          />
          <div className="final__ctas" data-reveal="up">
            <button type="button" className="btn btn--red" onClick={openOrder}>
              <PhoneIcon />
              Commander par téléphone
            </button>
            <a
              className="btn btn--ghost"
              href="#restaurants"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#restaurants')
              }}
            >
              Trouver un restaurant
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <Logo className="footer__logo" />
            <p>Street food thaï · Alger</p>
            <p className="footer__motto">Si tu aimes aujourd’hui, tu aimeras demain !</p>
          </div>
          <nav className="footer__nav" aria-label="Pied de page">
            {[
              ['#recette', 'La recette'],
              ['#menu', 'Menu'],
              ['#rituel', 'Le geste'],
              ['#desserts', 'Desserts'],
              ['#restaurants', 'Restaurants'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(href)
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="footer__social">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="footer__ig">
              <InstagramIcon />
              @thaisty.alger
            </a>
          </div>
        </div>
        <div className="container footer__legal">
          <p>© {YEAR} Thaisty Crousty</p>
          <p>Maquette de présentation · contenus, prix et adresses à valider avec la marque</p>
        </div>
      </footer>
    </>
  )
}
