import { useState } from 'react';
import { formatAddress, formatSlots, restaurant, todayInAlgiers } from '../data/restaurant';
import { Button } from './Button';
import { Icon } from './Icon';
import { SectionHeading } from './SectionHeading';
import styles from './Infos.module.css';

type CopyState = 'idle' | 'copied' | 'error';

export function Infos() {
  const [copy, setCopy] = useState<CopyState>('idle');
  const today = todayInAlgiers();
  const { street, postalCode, city, country } = restaurant.address;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${restaurant.name}, ${formatAddress()}`);
      setCopy('copied');
    } catch {
      setCopy('error');
    }
    window.setTimeout(() => setCopy('idle'), 2500);
  };

  return (
    <section id="infos" className={`section paper ${styles.infos}`} aria-labelledby="infos-title">
      <div className="container">
        <SectionHeading
          id="infos-title"
          eyebrow="Informations pratiques"
          script="Venir"
          title={
            <>
              Nous rendre <em>visite</em>
            </>
          }
        />

        <div className={styles.grid}>
          {/* Adresse */}
          <article className={styles.card} data-animate="fade-up">
            <p className={styles.label}>
              <Icon name="map" size={18} /> Adresse
            </p>
            <address className={styles.address}>
              <strong>{restaurant.name}</strong>
              <span>{street}</span>
              <span>
                {postalCode} {city}
              </span>
              <span>{country}</span>
            </address>
            <div className={styles.actions}>
              {restaurant.mapsUrl ? (
                <Button href={restaurant.mapsUrl} variant="outline" icon="map" data-magnetic>
                  Itinéraire
                  <span className="sr-only"> (Google Maps, nouvel onglet)</span>
                </Button>
              ) : (
                import.meta.env.DEV && (
                  <p className={styles.placeholder}>
                    Emplacement réservé : bouton « Itinéraire » (lien Google Maps à confirmer)
                  </p>
                )
              )}
              <button type="button" className={styles.copy} onClick={copyAddress}>
                {copy === 'copied' ? 'Adresse copiée ✓' : copy === 'error' ? 'Copie impossible' : 'Copier l’adresse'}
              </button>
              <span className="sr-only" aria-live="polite">
                {copy === 'copied' ? 'Adresse copiée dans le presse-papiers' : ''}
              </span>
            </div>
          </article>

          {/* Horaires */}
          <article className={styles.card} data-animate="fade-up">
            <p className={styles.label}>
              <Icon name="clock" size={18} /> Horaires
            </p>
            <dl className={styles.hours}>
              {restaurant.hours.map((day) => {
                const isToday = (day.days as readonly number[]).includes(today);
                return (
                  <div key={day.label} className={isToday ? styles.today : undefined}>
                    <dt>
                      {day.label}
                      {isToday && <span className={styles.badge}>Aujourd’hui</span>}
                    </dt>
                    <dd>
                      {formatSlots(day.slots)}
                      {'note' in day && day.note && <small>{day.note}</small>}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </article>

          {/* Contact */}
          <article className={`${styles.card} ${styles.contact}`} data-animate="fade-up">
            <p className={styles.label}>
              <Icon name="phone" size={18} /> Téléphone
            </p>
            <a href={restaurant.phone.href} className={styles.phone}>
              {restaurant.phone.display}
            </a>
            <Button href={restaurant.phone.href} icon="phone" data-magnetic>
              Nous appeler
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
