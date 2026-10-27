import type { MenuItem, MenuSection } from '../data/menu';
import { formatPrice } from '../lib/format';
import { MenuItemRow } from './MenuItemRow';
import styles from './MenuSectionBlock.module.css';

interface MenuSectionBlockProps {
  section: MenuSection;
  /** Sous-ensemble filtré (recherche) ; par défaut, tous les produits. */
  items?: MenuItem[];
  showExtras?: boolean;
}

export function MenuSectionBlock({ section, items = section.items, showExtras = true }: MenuSectionBlockProps) {
  return (
    <section id={`carte-${section.id}`} className={styles.block} aria-labelledby={`titre-${section.id}`}>
      <header className={styles.head}>
        <h3 id={`titre-${section.id}`} className={styles.title}>
          {section.title}
        </h3>
        {section.subtitle && <p className={styles.subtitle}>{section.subtitle}</p>}
      </header>

      <ul className={styles.items}>
        {items.map((item) => (
          <MenuItemRow key={item.name} item={item} missingPriceLabel={section.missingPriceLabel} />
        ))}
      </ul>

      {showExtras && section.supplements && (
        <div className={styles.supplements}>
          {section.supplements.map((group) => (
            <div key={group.title}>
              <p className={styles.groupTitle}>{group.title}</p>
              <ul className={styles.chips}>
                {group.items.map((supplement) => (
                  <li key={supplement.name}>
                    {supplement.name}
                    {supplement.price !== undefined && <span> · {formatPrice(supplement.price)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showExtras && section.note && <p className={styles.note}>{section.note}</p>}
    </section>
  );
}
