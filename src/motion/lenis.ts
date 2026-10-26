import type Lenis from 'lenis'

// Instance unique de Lenis, enregistrée par <SmoothScroll>. Absente au niveau « static ».
let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}

export const getLenis = () => instance

export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.4 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.classList.toggle('is-locked', locked)
}
