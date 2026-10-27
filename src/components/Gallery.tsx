import { useEffect, useRef } from 'react';
import { moodImages, realPhotos } from '../data/gallery';
import { gsap } from '../lib/motion';
import { Picture } from './Picture';
import { SectionHeading } from './SectionHeading';
import styles from './Gallery.module.css';

/**
 * Galerie : sur grand écran, la piste de photos défile horizontalement
 * pendant que la section reste épinglée ; sur mobile, grille verticale.
 */
export function Gallery() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current;
      if (!track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="galerie" className={styles.gallery} aria-labelledby="galerie-title">
      <div ref={pinRef} className={styles.pin}>
        <div className={`container ${styles.head}`}>
          <SectionHeading
            id="galerie-title"
            eyebrow="Galerie"
            script="Instants"
            title={
              <>
                Helena, <em>en images</em>
              </>
            }
            align="start"
            tone="light"
          />
          <p className={styles.legend}>Photographies prises chez Helena.</p>
        </div>

        <div ref={trackRef} className={styles.track}>
          {realPhotos.map((photo, index) => (
            <figure key={photo.name} className={styles.item} data-shape={index % 3}>
              <div className={styles.frame}>
                <Picture name={photo.name} alt={photo.alt} sizes="(min-width: 64rem) 30vw, 90vw" />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, '0')}</span> {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className={`container ${styles.mood}`}>
        <div className={styles.moodHead}>
          <h3 className={styles.moodTitle}>Inspirations d’ambiance</h3>
          <p className={styles.moodNote}>
            Illustrations créées pour évoquer l’univers Helena. Ce ne sont pas des photographies du restaurant ni de
            ses plats.
          </p>
        </div>
        <ul className={styles.moodGrid}>
          {moodImages.map((image) => (
            <li key={image.name}>
              <div className={styles.moodFrame}>
                <Picture name={image.name} alt={image.alt} sizes="(min-width: 48rem) 30vw, 90vw" />
                <span className={styles.badge}>Illustration</span>
              </div>
              <p>{image.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
