import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { TIER } from '../lib/capabilities'
import { useReveals } from '../motion/useReveals'
import './ritual.css'

// Images extraites de la vidéo de préparation fournie par le client.
const FRAMES = [
  { src: '01-panure', n: '01', title: 'La panure', text: 'Le poulet passe dans la chapelure, à la main.' },
  { src: '02-panier', n: '02', title: 'Le panier', text: 'Direction la friteuse.' },
  { src: '03-friture', n: '03', title: 'La friture', text: 'Ça bouillonne, ça dore, ça croustille.' },
  { src: '04-riz', n: '04', title: 'Le riz', text: 'Le riz blanc au fond du pot.' },
  { src: '05-sauce', n: '05', title: 'La sauce', text: 'Une première couche de sauce.' },
  { src: '06-poulet', n: '06', title: 'Le crousty', text: 'Les morceaux de poulet, un par un.' },
  { src: '07-nappage', n: '07', title: 'Le nappage', text: 'Le zigzag de sauce, généreux.' },
  { src: '08-oignons', n: '08', title: 'Le final', text: 'Oignons frits en pluie.' },
  { src: '09-couvercle', n: '09', title: 'Fermé', text: 'Le couvercle, et c’est parti.' },
]

export function Ritual() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useReveals(root)

  useGSAP(
    () => {
      if (TIER === 'static') return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current
        if (!el) return
        const distance = () => el.scrollWidth - window.innerWidth
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.ritual__pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        // Chaque image glisse légèrement dans son cadre pendant le défilement horizontal.
        gsap.utils.toArray<HTMLElement>('.ritual-card__img img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: img.closest('.ritual-card'),
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
        gsap.to('.ritual__progress-bar', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.ritual__pin', start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="rituel" className="ritual" aria-labelledby="ritual-title">
      <div className="ritual__pin">
        <div ref={track} className="ritual__track">
          <div className="ritual__intro">
            <p className="eyebrow" data-reveal="up">
              Le geste
            </p>
            <h2 id="ritual-title" className="ritual__title display" data-reveal="lines">
              Du panier
              <br />
              <span>au pot.</span>
            </h2>
            <p className="ritual__lead" data-reveal="up">
              Neuf images tirées de la vidéo de préparation Thaisty Crousty. Pas de mise en scène : la cuisine, telle
              qu’elle est.
            </p>
            <p className="ritual__hint" aria-hidden="true">
              Continue de défiler →
            </p>
          </div>
          {FRAMES.map((f, i) => (
            <figure key={f.src} className={`ritual-card ${i % 2 ? 'is-low' : ''}`}>
              <div className="ritual-card__img">
                <img
                  src={`/media/ritual/${f.src}.webp`}
                  width={760}
                  height={1561}
                  loading="lazy"
                  decoding="async"
                  alt={`${f.title} : ${f.text}`}
                />
              </div>
              <figcaption>
                <span className="ritual-card__n">{f.n}</span>
                <span className="ritual-card__title">{f.title}</span>
                <span className="ritual-card__text">{f.text}</span>
              </figcaption>
            </figure>
          ))}
          <div className="ritual__outro display" aria-hidden="true">
            <span>Crousty</span>
            <span className="halftone-text">Crousty</span>
          </div>
        </div>
        <div className="ritual__progress" aria-hidden="true">
          <span className="ritual__progress-bar" />
        </div>
      </div>
    </section>
  )
}
