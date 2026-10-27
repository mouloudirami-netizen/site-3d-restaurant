import { Button } from '../components/Button';
import { MenuItemRow } from '../components/MenuItemRow';
import { Ornament } from '../components/Ornament';
import { Picture } from '../components/Picture';
import { SectionHeading } from '../components/SectionHeading';
import { restaurant } from '../data/restaurant';
import styles from './StyleGuide.module.css';

// Planche de validation de l'étape 3 (temporaire).
const swatches = [
  { name: 'Rose poudré', token: '--rose-200', hex: '#EBCFD2', role: 'Dominante' },
  { name: 'Rose pâle', token: '--rose-100', hex: '#F6E6E6', role: 'Surfaces' },
  { name: 'Crème', token: '--cream', hex: '#FBF6F1', role: 'Fond, respiration' },
  { name: 'Bordeaux', token: '--bordeaux-600', hex: '#6E1F33', role: 'Accents, prix, boutons' },
  { name: 'Encre', token: '--ink', hex: '#2A1A1C', role: 'Texte' },
  { name: 'Or doux', token: '--gold', hex: '#B8956A', role: 'Filets décoratifs' },
];

export function StyleGuide() {
  return (
    <>
      <section id="accueil" className={styles.preview}>
        <Picture name="salle-roses" alt="La salle de Helena et son plafond de roses" priority className={styles.previewImg} />
        <div className={styles.previewOverlay} />
        <div className={styles.previewContent}>
          <p className={styles.previewEyebrow}>{restaurant.tagline}</p>
          <h1 className={styles.previewTitle}>Helena</h1>
          <p className={styles.previewLead}>Aperçu des fondations — le vrai hero arrive à l’étape 4.</p>
          <div className={styles.actions}>
            <Button href="#carte" variant="primary" icon="arrow" iconPosition="end">
              Découvrir la carte
            </Button>
            <Button href="#infos" variant="light" icon="map">
              Nous trouver
            </Button>
          </div>
        </div>
      </section>

      <section className="section paper" style={{ background: 'var(--rose-100)' }}>
        <div className="container">
          <SectionHeading eyebrow="Fondations" script="Palette" title={<>Les couleurs <em>Helena</em></>} />
          <ul className={styles.swatches}>
            {swatches.map((s) => (
              <li key={s.token}>
                <span className={styles.chip} style={{ background: `var(${s.token})` }} />
                <strong>{s.name}</strong>
                <code>{s.hex}</code>
                <span>{s.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Fondations" script="Typographie" title="Trois voix, un même ton" />
          <div className={styles.typeGrid}>
            <div>
              <p className={styles.label}>Titres — Cormorant Garamond</p>
              <p className={styles.display}>
                L’art de <em>recevoir</em>
              </p>
            </div>
            <div>
              <p className={styles.label}>Accent calligraphié — Pinyon Script (décor uniquement)</p>
              <p className={`script ${styles.scriptSample}`}>Brunch &amp; Douceurs</p>
            </div>
            <div>
              <p className={styles.label}>Interface &amp; lecture — Jost</p>
              <p className="lead">Un moment suspendu sous les fleurs, entre un café serré et une brioche dorée.</p>
              <p className={styles.body}>
                Texte courant lisible : informations pratiques, descriptions de plats, horaires. Ouvert du samedi au
                jeudi de 8 h à 23 h 30.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="carte" className="section paper" style={{ background: 'var(--rose-200)' }}>
        <div className="container">
          <SectionHeading eyebrow="Composants" script="La carte" title="Lignes de menu" />
          <div className={styles.menuSample}>
            <MenuItemRow
              name="Avocat & Saumon fumé"
              price={1600}
              description="Fromage tartine, mousse d’avocat, saumon fumé, garniture de salade verte, tomates cerises et cornichons."
            />
            <MenuItemRow name="Burger Hel&Na" price={1600} description="Filet de bœuf, tomate, salade, sauce Helena." />
            <MenuItemRow name="Spanish Latte" price={700} description="Espresso, milk intense, lait." />
            <MenuItemRow name="Loup de mer" price={null} description="Grillé, farci, mille-feuille." />
          </div>
        </div>
      </section>

      <section id="infos" className="section">
        <div className="container">
          <SectionHeading eyebrow="Composants" script="Boutons" title="Actions" />
          <div className={styles.buttons}>
            <Button href={restaurant.phone.href} icon="phone">
              Nous appeler
            </Button>
            <Button href="#carte" variant="outline" icon="arrow" iconPosition="end">
              Voir la carte
            </Button>
            <Button href={restaurant.social.instagram} variant="ghost" icon="instagram">
              Instagram
            </Button>
            <Button href={restaurant.social.tiktok} variant="ghost" icon="tiktok">
              TikTok
            </Button>
          </div>
          <Ornament className={styles.centerOrnament} />
        </div>
      </section>
    </>
  );
}
