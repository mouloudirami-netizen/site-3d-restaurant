import { CallButton } from './components/CallButton';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { StyleGuide } from './dev/StyleGuide';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  const reducedMotion = useReducedMotion();
  useSmoothScroll(!reducedMotion);

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Nav />
      <main id="contenu">
        <Hero />
        {/* Planche des fondations (temporaire), remplacée par les sections de l'étape 5. */}
        <StyleGuide />
      </main>
      <CallButton />
    </>
  );
}
