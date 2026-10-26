import { LOGO_ACCENT_PATH, LOGO_VIEWBOX, LOGO_WORDMARK_PATH } from './logoPaths'

type Props = {
  className?: string
  title?: string
  accent?: string
}

export function Logo({ className, title = 'Thaisty Crousty', accent = 'var(--orange)' }: Props) {
  return (
    <svg className={className} viewBox={LOGO_VIEWBOX} role="img" aria-label={title}>
      <path fill="currentColor" fillRule="evenodd" d={LOGO_WORDMARK_PATH} />
      <path fill={accent} fillRule="evenodd" d={LOGO_ACCENT_PATH} />
    </svg>
  )
}

// La flamme du « i », isolée à partir du même tracé.
export function Flame({ className, color = 'var(--orange)' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="216.5 50.5 19.5 23.5" aria-hidden="true">
      <path fill={color} fillRule="evenodd" d={LOGO_ACCENT_PATH} />
    </svg>
  )
}
