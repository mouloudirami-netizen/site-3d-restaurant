import { Brunch } from './components/Brunch';
import { CallButton } from './components/CallButton';
import { Carte } from './components/Carte';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Infos } from './components/Infos';
import { Nav } from './components/Nav';
import { Social } from './components/Social';
import { Univers } from './components/Univers';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollReveals } from './hooks/useScrollReveals';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  const reducedMotion = useReducedMotion();
  useSmoothScroll(!reducedMotion);
  useScrollReveals(!reducedMotion);

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Nav />
      <main id="contenu">
        <Hero />
        <Univers />
        <Brunch />
        <Carte />
        <Gallery />
        <Infos />
        <Social />
      </main>
      <Footer />
      <CallButton />
      <Cursor />
    </>
  );
}
