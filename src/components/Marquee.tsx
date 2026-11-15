import { Fragment } from 'react'
import { Flame } from '../brand/Logo'
import './marquee.css'

// Bandeau décoratif ; les mots viennent du motif officiel de la marque.
export function Marquee({ items, reverse = false, tone = 'orange' }: { items: string[]; reverse?: boolean; tone?: 'orange' | 'dark' }) {
  const row = (
    <div className="marquee__row">
      {items.map((t, i) => (
        <Fragment key={i}>
          <span className="marquee__item" dir="auto">
            {t}
          </span>
          <Flame className="marquee__flame" color={tone === 'orange' ? 'var(--black)' : 'var(--orange)'} />
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className={`marquee marquee--${tone} ${reverse ? 'is-reverse' : ''}`} aria-hidden="true">
      <div className="marquee__inner">
        {row}
        {row}
      </div>
    </div>
  )
}
