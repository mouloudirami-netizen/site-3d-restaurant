import { useRef } from 'react'
import { Logo } from '../brand/Logo'
import { useReveals } from '../motion/useReveals'
import './identity.css'

const SHOTS = [
  { id: 'essentials', caption: 'Campagne « Essentials ta3 had lyamat »', cls: 'is-tall', w: 1170, h: 1433 },
  { id: 'enseigne', caption: 'L’enseigne lumineuse', cls: 'is-wide', w: 1170, h: 909 },
  { id: 'workout', caption: 'Campagne « Workout done! »', cls: 'is-mid', w: 1170, h: 1441 },
  { id: 'facade-ouverture', caption: 'Jour d’ouverture', cls: 'is-mid', w: 1170, h: 1556 },
  { id: 'slogan-cuisine', caption: 'En cuisine', cls: 'is-tall', w: 1170, h: 1524 },
]

export function Identity() {
  const root = useRef<HTMLElement>(null)
  useReveals(root)

  return (
    <section ref={root} id="univers" className="identity" aria-labelledby="identity-title">
      <div className="container">
        <header className="identity__head">
          <div>
            <p className="eyebrow" data-reveal="up">
              L’univers
            </p>
            <h2 id="identity-title" className="identity__title display" data-reveal="lines">
              Les essentiels
              <br />
              <span>ta3 had lyamat.</span>
            </h2>
          </div>
          <div className="identity__aside" data-reveal="up">
            <Logo className="identity__logo" />
            <p>
              Le pot noir à la flamme orange. La devise imprimée tout autour. Les affiches en darija, l’enseigne qui
              s’allume le soir. Thaisty Crousty, c’est un bol, et tout ce qui va avec.
            </p>
          </div>
        </header>

        <div className="identity__grid">
          {SHOTS.map((s) => (
            <figure key={s.id} className={`identity__shot ${s.cls}`}>
              <div className="identity__frame" data-reveal="clip">
                <img
                  src={`/media/photos/${s.id}-1170.webp`}
                  srcSet={`/media/photos/${s.id}-640.webp 640w, /media/photos/${s.id}-1170.webp 1170w`}
                  sizes="(min-width: 900px) 33vw, 92vw"
                  width={s.w}
                  height={s.h}
                  loading="lazy"
                  decoding="async"
                  alt={s.caption}
                />
              </div>
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
