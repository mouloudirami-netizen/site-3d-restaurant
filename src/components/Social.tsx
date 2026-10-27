import { restaurant } from '../data/restaurant';
import { Icon, type IconName } from './Icon';
import { Picture } from './Picture';
import styles from './Social.module.css';

const networks: { id: 'instagram' | 'tiktok'; label: string; icon: IconName; invite: string; image: string }[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'instagram',
    invite: 'Le décor, les assiettes et les nouveautés, en images.',
    image: 'salle-roses',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'tiktok',
    invite: 'L’ambiance Helena, en vidéos.',
    image: 'brioche-dattes',
  },
];

export function Social() {
  return (
    <section className={styles.social} aria-labelledby="social-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <p className="eyebrow">Réseaux sociaux</p>
          <h2 id="social-title" className={styles.title}>
            Suivez <em>Helena</em>
          </h2>
          <p className={styles.lead}>Retrouvez l’univers Helena au quotidien sur ses comptes officiels.</p>
        </div>

        <ul className={styles.cards}>
          {networks.map((network) => {
            const { url, handle } = restaurant.social[network.id];
            return (
              <li key={network.id} data-animate="fade-up">
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.card}>
                  <span className={styles.bg} aria-hidden="true">
                    <Picture name={network.image} alt="" sizes="(min-width: 64rem) 30vw, 90vw" />
                  </span>
                  <span className={styles.icon}>
                    <Icon name={network.icon} size={26} />
                  </span>
                  <span className={styles.body}>
                    <span className={styles.network}>{network.label}</span>
                    <span className={styles.handle}>{handle}</span>
                    <span className={styles.invite}>{network.invite}</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    <Icon name="arrow" size={22} />
                  </span>
                  <span className="sr-only">(ouvre {network.label} dans un nouvel onglet)</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
