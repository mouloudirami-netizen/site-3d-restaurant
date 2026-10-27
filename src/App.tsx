import { CallButton } from './components/CallButton';
import { Nav } from './components/Nav';
import { StyleGuide } from './dev/StyleGuide';

export function App() {
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Nav />
      <main id="contenu">
        {/* Étape 3 : planche des fondations, remplacée par les vraies sections à l'étape 4. */}
        <StyleGuide />
      </main>
      <CallButton />
    </>
  );
}
