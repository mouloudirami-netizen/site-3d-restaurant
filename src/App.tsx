import { Brunch } from './components/Brunch';
import { CallButton } from './components/CallButton';
import { Cursor } from './components/Cursor';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
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
        <Gallery />
      </main>
      <CallButton />
      <Cursor />
    </>
  );
}
