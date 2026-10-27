import { restaurant } from '../data/restaurant';
import { Icon } from './Icon';
import styles from './CallButton.module.css';

/**
 * Accès permanent à l'appel :
 * - ordinateur : bouton flottant « Nous appeler » ;
 * - mobile : barre d'action fixe (appel + carte), respectant la zone sûre iOS.
 */
export function CallButton() {
  return (
    <aside aria-label="Actions rapides">
      <a
        href={restaurant.phone.href}
        className={styles.floating}
        data-magnetic
        aria-label={`Nous appeler au ${restaurant.phone.display}`}
      >
        <span className={styles.pulse} aria-hidden="true" />
        <Icon name="phone" size={18} />
        <span>Nous appeler</span>
      </a>

      <div className={styles.bar}>
        <a href={restaurant.phone.href} className={styles.call}>
          <Icon name="phone" size={18} />
          <span>Appeler</span>
        </a>
        <a href="#carte" className={styles.secondary}>
          <Icon name="book" size={18} />
          <span>La carte</span>
        </a>
      </div>
    </aside>
  );
}
