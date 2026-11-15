import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { TIER } from '../lib/capabilities'

class ThreeErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.error('[three] scène désactivée, affichage du visuel statique', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

type Props = {
  className?: string
  fallback?: ReactNode
  /** Monte le canvas un peu avant que la zone n'entre dans l'écran. */
  rootMargin?: string
  children: (state: { active: boolean }) => ReactNode
}

/**
 * Monte une scène 3D chargée à la demande uniquement si l'appareil le permet (niveau ≠ static),
 * la met en pause hors écran et bascule sur le visuel statique en cas d'erreur WebGL.
 */
export function CanvasGate({ className, fallback = null, rootMargin = '100% 0px', children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (TIER === 'static' || !ref.current) return
    // Monté à l'approche (marge), démonté quand la zone est loin : libère la mémoire GPU.
    // Le rendu n'est actif que lorsque la zone est réellement visible.
    const mount = new IntersectionObserver(([entry]) => setMounted(entry.isIntersecting), { rootMargin })
    const visible = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting))
    mount.observe(ref.current)
    visible.observe(ref.current)
    return () => {
      mount.disconnect()
      visible.disconnect()
    }
  }, [rootMargin])

  return (
    <div ref={ref} className={className} aria-hidden="true" style={{ visibility: TIER === 'static' || active ? undefined : 'hidden' }}>
      {TIER === 'static' ? (
        fallback
      ) : mounted ? (
        <ThreeErrorBoundary fallback={fallback}>
          <Suspense fallback={null}>{children({ active })}</Suspense>
        </ThreeErrorBoundary>
      ) : null}
    </div>
  )
}
