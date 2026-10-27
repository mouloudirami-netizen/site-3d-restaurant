import { PetalField } from './PetalField';
import { Picture } from './Picture';
import { SectionHeading } from './SectionHeading';
import styles from './Univers.module.css';

const moments = [
  {
    title: 'Le brunch',
    text: 'Une table qui se remplit doucement : viennoiseries, tartines, granola et café crémeux.',
    image: 'brunch-table',
    alt: 'Une table de brunch chez Helena : tartines saumon-avocat, pancakes, cookies et cappuccino',
    href: '#brunch',
  },
  {
    title: 'Les douceurs',
    text: 'Pancakes nappés de caramel, brioches dorées, gaufres et crêpes à partager… ou pas.',
    image: 'pancakes-banane',
    alt: 'Pancakes à la banane caramélisée et sucre glace servis chez Helena',
    href: '#carte',
  },
  {
    title: 'Les boissons',
    text: 'Smoothies, jus, mocktails et cafés glacés, pour prolonger l’instant.',
    image: 'smoothie-fraise',
    alt: 'Smoothie à la fraise garni de pomme, d’orange et de menthe chez Helena',
    href: '#carte',
  },
] as const;

export function Univers() {
  return (
    <section id="univers" className={`section paper ${styles.univers}`} aria-labelledby="univers-title">
      <PetalField density={0.4} opacity={0.75} className={styles.petals} />
      <p className={styles.watermark} aria-hidden="true" data-parallax="0.35">
        HELENA
      </p>

      <div className={`container ${styles.intro}`}>
        <div className={styles.text}>
          <SectionHeading
            id="univers-title"
            eyebrow="Notre univers"
            script="Bienvenue"
            title={
              <>
                Un jardin suspendu <em>au-dessus de la table</em>
              </>
            }
            align="start"
          />
          <p className="lead" data-animate="fade-up">
            Chez Helena, les fleurs descendent du plafond comme une pluie de printemps. Sous les lustres, le temps
            ralentit.
          </p>
          <p className={styles.body} data-animate="fade-up">
            Un café le matin, un brunch qui s’étire, un déjeuner entre amis ou une douceur en fin de journée : chaque
            moment trouve sa place, dans un décor pensé pour s’attarder.
          </p>
        </div>

        <div className={styles.collage}>
          <figure className={styles.main} data-animate="curtain">
            <Picture
              name="salle-glycine"
              alt="La salle de Helena sous une cascade de glycine blanche, avec son mur de fleurs"
              sizes="(min-width: 64rem) 40vw, 90vw"
            />
          </figure>
          <figure className={styles.secondary} data-parallax="0.12">
            <Picture
              name="brioche-dattes"
              alt="Brioche dorée aux dattes caramélisées et noix, servie chez Helena"
              sizes="(min-width: 64rem) 20vw, 45vw"
            />
          </figure>
        </div>
      </div>

      <div className={`container ${styles.moments}`}>
        {moments.map((moment, index) => (
          <a key={moment.title} href={moment.href} className={styles.moment} data-animate="fade-up">
            <div className={styles.momentImage}>
              <Picture name={moment.image} alt={moment.alt} sizes="(min-width: 64rem) 30vw, 90vw" />
            </div>
            <p className={styles.momentIndex}>0{index + 1}</p>
            <h3 className={styles.momentTitle}>{moment.title}</h3>
            <p className={styles.momentText}>{moment.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
