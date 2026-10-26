import { lazy, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Logo } from '../brand/Logo'
import { useOrder } from '../components/orderContext'
import { ArrowDownIcon, PhoneIcon } from '../components/Icons'
import { scrollToTarget } from '../motion/lenis'
import { scrollState } from '../motion/scrollState'
import { TIER } from '../lib/capabilities'
import { CanvasGate } from '../three/CanvasGate'
import './hero.css'

const HeroParticles = lazy(() => import('../three/HeroParticles'))

const GIANT = 'CROUSTY'.split('')

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { openOrder } = useOrder()

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Séquence d'entrée : fond → typographie → produit → particules → interface.
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero__glow', { autoAlpha: 0, scale: 0.6, duration: 1.6 }, 0)
          .from('.hero__giant-char', { yPercent: 110, duration: 1.3, stagger: 0.045 }, 0.1)
          .from('.hero__logo', { clipPath: 'inset(0% 0% 100% 0%)', y: 40, duration: 1.2 }, 0.25)
          .from('.hero__bowl', { y: 160, scale: 0.82, rotate: -8, autoAlpha: 0, duration: 1.6 }, 0.35)
          .from('.hero__shadow', { scaleX: 0.3, autoAlpha: 0, duration: 1.4 }, 0.5)
          .from('.hero__canvas', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0.7)
          .from('.hero__reveal', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.8)
          .from('.hero__vertical', { autoAlpha: 0, x: 20, duration: 1 }, 1)

        // Défilement : le bol avance vers nous, la typographie part dans l'autre sens.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('.hero__bowl-wrap', { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: st })
        gsap.to('.hero__giant', { xPercent: -14, ease: 'none', scrollTrigger: st })
        gsap.to('.hero__logo', { yPercent: -60, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } })
        gsap.to('.hero__bottom', { y: -60, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '45% top' } })
        gsap.to({}, {
          scrollTrigger: {
            ...st,
            onUpdate: (self) => {
              scrollState.heroProgress = self.progress
            },
          },
        })
      })

      // Inclinaison du bol au pointeur, uniquement avec une souris.
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const rx = gsap.quickTo('.hero__bowl', 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const ry = gsap.quickTo('.hero__bowl', 'rotationY', { duration: 0.9, ease: 'power3.out' })
        const gx = gsap.quickTo('.hero__giant', 'x', { duration: 1.2, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          const x = e.clientX / window.innerWidth - 0.5
          const y = e.clientY / window.innerHeight - 0.5
          scrollState.pointerX = x
          scrollState.pointerY = y
          rx(-y * 10)
          ry(x * 14)
          gx(-x * 40)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__motif hero__motif--left motif" aria-hidden="true" />
      <div className="hero__motif hero__motif--right motif" aria-hidden="true" />

      <div className="hero__giant display" aria-hidden="true">
        {GIANT.map((c, i) => (
          <span className="hero__giant-mask" key={i}>
            <span className="hero__giant-char halftone-text">{c}</span>
          </span>
        ))}
      </div>

      <h1 id="hero-title" className="hero__title">
        <Logo className="hero__logo" />
        <span className="sr-only"> — street food thaï à Alger</span>
      </h1>

      <div className="hero__bowl-wrap">
        <div className="hero__shadow" aria-hidden="true" />
        <picture>
          <source media="(max-width: 640px)" srcSet="/media/bowls/spicy-560.webp" />
          <img
            className="hero__bowl"
            src="/media/bowls/spicy-1000.webp"
            width={987}
            height={763}
            alt="Bol Crousty Spicy : poulet crousty, sauce blanche et sauce piquante dans le pot noir Thaisty Crousty"
            fetchPriority="high"
          />
        </picture>
      </div>

      <CanvasGate className="hero__canvas">
        {({ active }) => <HeroParticles active={active} />}
      </CanvasGate>

      <div className="hero__vertical-wrap" aria-hidden="true">
        <p className="hero__vertical">Si tu aimes aujourd’hui, tu aimeras demain !</p>
      </div>

      <div className="hero__bottom container">
        <div className="hero__intro">
          <p className="eyebrow hero__reveal">Street food thaï · Alger</p>
          <p className="hero__pitch hero__reveal">
            Riz blanc, poulet <em>crousty</em>, sauces généreuses.
            <br />
            Huit restaurants, un seul bol.
          </p>
        </div>
        <div className="hero__ctas hero__reveal">
          <a
            className="btn"
            href="#menu"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#menu')
            }}
          >
            Voir le menu
          </a>
          <button className="btn btn--red" type="button" onClick={openOrder}>
            <PhoneIcon />
            Commander
          </button>
        </div>
      </div>

      <a
        className="hero__scroll hero__reveal"
        href="#manifeste"
        onClick={(e) => {
          e.preventDefault()
          scrollToTarget('#manifeste')
        }}
      >
        <ArrowDownIcon />
        <span className="sr-only">Découvrir</span>
      </a>
    </section>
  )
}
