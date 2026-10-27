import { formatPrice } from '../lib/format';
import styles from './MenuItemRow.module.css';

interface MenuItemRowProps {
  name: string;
  price: number | null;
  description?: string;
  /** Texte affiché quand le prix n'est pas renseigné sur le menu. */
  missingPriceLabel?: string;
}

export function MenuItemRow({
  name,
  price,
  description,
  missingPriceLabel = 'Nous consulter',
}: MenuItemRowProps) {
  return (
    <div className={styles.row}>
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
    </div>
  );
}
