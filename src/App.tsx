import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SmoothScroll } from './motion/SmoothScroll'
import { OrderProvider } from './components/OrderDialog'
import { Marquee } from './components/Marquee'
import { TIER } from './lib/capabilities'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Anatomy } from './sections/Anatomy'
import { Menu } from './sections/Menu'
import { Ritual } from './sections/Ritual'
import { Crunch } from './sections/Crunch'
import { Desserts } from './sections/Desserts'
import { Identity } from './sections/Identity'
import { Restaurants } from './sections/Restaurants'
import { FinalCta } from './sections/FinalCta'

// Mots tirés du motif officiel de la marque (darija, arabe, français).
const WORDS_A = ['Crousti & Spicy', 'Wesh !', 'Croustaholic', 'كروستي', 'Kho !', 'Street food thaï', 'تايستي']
const WORDS_B = ['Si tu aimes aujourd’hui', 'tu aimeras demain !', 'Thaisty Sweety', 'Crème dessert', 'Tiramisu']

export default function App() {
  useEffect(() => {
    document.documentElement.dataset.tier = TIER
    // Les polices et images changent la mise en page : recalculer les déclencheurs une fois chargées.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <SmoothScroll tier={TIER}>
      <OrderProvider>
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <Manifesto />
          <Marquee items={WORDS_A} />
          <Anatomy />
          <Menu />
          <Ritual />
          <Crunch />
          <Marquee items={WORDS_B} reverse tone="dark" />
          <Desserts />
          <Identity />
          <Restaurants />
          <FinalCta />
        </main>
      </OrderProvider>
    </SmoothScroll>
  )
}
