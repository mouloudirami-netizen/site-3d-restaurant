import { useRef } from 'react'
import { Logo } from '../brand/Logo'
import { useReveals } from '../motion/useReveals'
import './identity.css'

const SHOTS = [
  { id: 'enseigne', caption: 'L’enseigne lumineuse', cls: 'is-wide', w: 1170, h: 909 },
  { id: 'facade-ouverture', caption: 'Jour d’ouverture', cls: 'is-half', w: 1170, h: 1556 },
  { id: 'slogan-cuisine', caption: 'En cuisine', cls: 'is-half is-low', w: 1170, h: 1524 },
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
              La marque
            </p>
            <h2 id="identity-title" className="identity__title display" data-reveal="lines">
              L’univers
              <br />
              <span>Thaisty.</span>
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
                  src={`media/photos/${s.id}-1170.webp`}
                  srcSet={`media/photos/${s.id}-640.webp 640w, media/photos/${s.id}-1170.webp 1170w`}
                  sizes={s.cls === 'is-wide' ? '(min-width: 900px) 92vw, 92vw' : '(min-width: 700px) 46vw, 92vw'}
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
