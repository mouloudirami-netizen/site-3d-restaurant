import { navLinks } from '../data/navigation';
import { formatSlots, restaurant } from '../data/restaurant';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Ornament } from './Ornament';
import styles from './Footer.module.css';

export function Footer() {
  const { street, postalCode, city, country } = restaurant.address;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo size={88} />
          <p className={`script ${styles.script}`}>Helena</p>
          <p className={styles.tagline}>{restaurant.tagline}</p>
        </div>

        <nav aria-label="Navigation secondaire" className={styles.col}>
          <h2 className={styles.heading}>Explorer</h2>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Nous trouver</h2>
          <address>
            {street}
            <br />
            {postalCode} {city}, {country}
          </address>
          <a href={restaurant.phone.href} className={styles.phone}>
            <Icon name="phone" size={16} /> {restaurant.phone.display}
          </a>
          {restaurant.mapsUrl && (
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.phone}>
              <Icon name="map" size={16} /> Itinéraire Google Maps
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          )}
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Horaires</h2>
          <ul>
            {restaurant.hours.map((day) => (
              <li key={day.label}>
                <span className={styles.day}>{day.label}</span>
                <span>{formatSlots(day.slots)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.social}>
            <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Helena (nouvel onglet)">
              <Icon name="instagram" size={20} />
            </a>
            <a href={restaurant.social.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok de Helena (nouvel onglet)">
              <Icon name="tiktok" size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <Ornament className={styles.ornament} />
        <p>
          © {new Date().getFullYear()} {restaurant.name} · {restaurant.area}, Alger
        </p>
        <p>Prix en dinars algériens (DA), à titre indicatif.</p>
      </div>
    </footer>
  );
}
