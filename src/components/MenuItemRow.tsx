import type { MenuItem } from '../data/menu';
import { formatPrice } from '../lib/format';
import styles from './MenuItemRow.module.css';

interface MenuItemRowProps {
  item: MenuItem;
  /** Texte affiché quand le prix n'est pas renseigné sur le menu. */
  missingPriceLabel?: string;
}

export function MenuItemRow({ item, missingPriceLabel = 'Prix : nous consulter' }: MenuItemRowProps) {
  const { name, price, description, includes, note } = item;
  return (
    <li className={styles.row}>
      <div className={styles.line}>
        <h4 className={styles.name}>{name}</h4>
        <span className={styles.leader} aria-hidden="true" />
        {price === null ? (
          <span className={`${styles.price} ${styles.missing}`}>{missingPriceLabel}</span>
        ) : (
          <data className={styles.price} value={price}>
            {formatPrice(price)}
          </data>
        )}
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {includes && (
        <ul className={styles.includes}>
          {includes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {note && <p className={styles.note}>{note}</p>}
    </li>
  );
}
