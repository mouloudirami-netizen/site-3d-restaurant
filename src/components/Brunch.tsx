import { brunchFormulas } from '../data/menu';
import { formatPrice } from '../lib/format';
import { Ornament } from './Ornament';
import { Picture } from './Picture';
import styles from './Brunch.module.css';

export function Brunch() {
  const { items, supplements, subtitle, note } = brunchFormulas;

  return (
    <section id="brunch" className={`section paper ${styles.brunch}`} aria-labelledby="brunch-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <div className={styles.sticky}>
            <p className="eyebrow">Formules brunch</p>
            <p className={`script ${styles.script}`} aria-hidden="true">
              Brunch
            </p>
            <h2 id="brunch-title" className={styles.title}>
              Quatre façons de <em>prendre son temps</em>
            </h2>
            <p className={styles.hours}>{subtitle}</p>
            <figure className={styles.photo} data-animate="curtain">
              <Picture
                name="brunch-table"
                alt="Table de brunch chez Helena : tartines saumon-avocat, pancakes, bol de granola, cookies et cappuccino"
                sizes="(min-width: 64rem) 34vw, 90vw"
              />
            </figure>
          </div>
        </div>

        <div className={styles.formulas}>
          {items.map((formula, index) => (
            <article key={formula.name} className={styles.card} data-animate="fade-up">
              <header className={styles.cardHead}>
                <span className={styles.index}>0{index + 1}</span>
                <h3 className={styles.name}>{formula.name}</h3>
                {formula.price !== null && (
                  <data className={styles.price} value={formula.price}>
                    {formatPrice(formula.price)}
                  </data>
                )}
              </header>
              <Ornament className={styles.ornament} />
              <ul className={styles.includes}>
                {formula.includes?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}

          {supplements && (
            <aside className={styles.supplements} aria-label="Suppléments du brunch" data-animate="fade-up">
              {supplements.map((group) => (
                <div key={group.title} className={styles.group}>
                  <h3 className={styles.groupTitle}>{group.title}</h3>
                  <ul className={styles.chips}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {note && <p className={styles.note}>{note}</p>}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
