import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { setLenis } from './lenis'
import type { Tier } from '../lib/capabilities'

function ScrollTriggerBridge() {
  // Lenis notifie ScrollTrigger à chaque défilement.
  useLenis(ScrollTrigger.update)
  return null
}

export function SmoothScroll({ tier, children }: { tier: Tier; children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    if (tier === 'static') return
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    setLenis(lenisRef.current?.lenis ?? null)
    return () => {
      gsap.ticker.remove(update)
      setLenis(null)
    }
  }, [tier])

  if (tier === 'static') return <>{children}</>

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: tier === 'lite' ? 0.18 : 0.1, anchors: false }} ref={lenisRef}>
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  )
}
