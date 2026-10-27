import { useEffect, useRef, useState } from 'react';
import { restaurant } from '../data/restaurant';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { gsap, prefersLightMedia, prefersReducedMotion } from '../lib/motion';
import { Button } from './Button';
import { PetalField } from './PetalField';
import { Picture } from './Picture';
import styles from './Hero.module.css';

type Phase = 'film' | 'photo';

const TITLE = 'Helena';
/** Délai au-delà duquel on abandonne la vidéo si elle n'a pas démarré (autoplay bloqué, réseau lent). */
const START_TIMEOUT_MS = 4000;

const pickVideo = () =>
  window.matchMedia('(max-aspect-ratio: 1/1)').matches
    ? { src: '/media/hero-mobile.mp4', poster: '/media/hero-poster-mobile.webp' }
    : { src: '/media/hero-desktop.mp4', poster: '/media/hero-poster-desktop.webp' };

/**
 * Hero « option C » : le film d'ambiance s'ouvre sur le site, puis un fondu
 * enchaîné révèle une vraie photo de la salle, qui reste à l'écran.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const [useFilm] = useState(() => !prefersLightMedia() && !prefersReducedMotion());
  const [video] = useState(pickVideo);
  const [phase, setPhase] = useState<Phase>(useFilm ? 'film' : 'photo');
  const [paused, setPaused] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  // La vraie photo ne remplace le film qu'une fois réellement affichable.
  const showPhoto = phase === 'photo' && photoReady;

  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Repli sur la photo ; en cas d'échec du film, on coupe son téléchargement pour libérer le réseau. */
  const fallbackToPhoto = () => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.removeAttribute('src');
      el.load();
    }
    setPhase('photo');
  };

  // Repli automatique si la vidéo ne démarre pas (autoplay bloqué, réseau lent).
  useEffect(() => {
    if (phase !== 'film') return;
    const el = videoRef.current;
    if (!el) return;
    const timer = window.setTimeout(() => {
      if (el.paused && el.currentTime === 0) fallbackToPhoto();
    }, START_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Photo déjà en cache : l'événement load a pu précéder l'abonnement.
  useEffect(() => {
    const img = mediaRef.current?.querySelector<HTMLImageElement>('[data-hero-photo] img');
    if (img?.complete && img.naturalWidth > 0) setPhotoReady(true);
  }, [phase]);

  // Animations d'entrée et de défilement.
  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 })
        .from('[data-reveal="eyebrow"]', { y: 20, opacity: 0, duration: 1.2 })
        .from('[data-reveal="letter"]', { yPercent: 110, rotate: 6, duration: 1.6, stagger: 0.07 }, '-=0.9')
        .from('[data-reveal="line"]', { y: 24, opacity: 0, duration: 1.2, stagger: 0.12 }, '-=1.1')
        .from('[data-reveal="cta"]', { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, '-=0.9')
        .from('[data-reveal="foot"]', { opacity: 0, duration: 1.2 }, '-=0.6');

      const scroll = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(mediaRef.current, { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: scroll });
      gsap.to(contentRef.current, { yPercent: -22, opacity: 0, ease: 'none', scrollTrigger: { ...scroll, end: '70% top' } });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const togglePlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPaused(false);
    } else {
      el.pause();
      setPaused(true);
    }
  };

  const replay = () => {
    setPaused(false);
    setPhase('film');
    const el = videoRef.current;
    if (el) {
      if (!el.getAttribute('src')) el.src = video.src;
      el.currentTime = 0;
      void el.play();
    }
  };

  return (
    <section id="accueil" ref={rootRef} className={styles.hero} aria-labelledby="hero-title">
      <div ref={mediaRef} className={styles.media}>
        <div
          className={[styles.photo, showPhoto && styles.photoActive].filter(Boolean).join(' ')}
          data-hero-photo
        >
          <Picture
            name="salle-roses"
            alt="La salle de Helena, son plafond de roses et ses lustres"
            sizes="100vw"
            priority={!useFilm}
            onLoad={() => setPhotoReady(true)}
          />
        </div>

        {useFilm && (
          <video
            ref={videoRef}
            className={[styles.video, showPhoto && styles.videoHidden].filter(Boolean).join(' ')}
            src={video.src}
            poster={video.poster}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onEnded={() => setPhase('photo')}
            onError={fallbackToPhoto}
          />
        )}
        <div className={styles.veil} />
      </div>

      <PetalField density={0.8} />

      <div ref={contentRef} className={styles.content}>
        <p className={styles.eyebrow} data-reveal="eyebrow">
          {restaurant.tagline}
        </p>
        <h1 id="hero-title" className={styles.title} aria-label={TITLE}>
          {[...TITLE].map((letter, index) => (
            <span key={index} className={styles.letterMask} aria-hidden="true">
              <span className={styles.letter} data-reveal="letter">
                {letter}
              </span>
            </span>
          ))}
        </h1>
        <p className={styles.tagline}>
          <span data-reveal="line">Sous une voûte de fleurs,</span>{' '}
          <span data-reveal="line">chaque instant se savoure.</span>
        </p>
        <p className={styles.sub} data-reveal="line">
          Cafés, brunchs et tables gourmandes à {restaurant.area}.
        </p>
        <div className={styles.actions}>
          <span data-reveal="cta">
            <Button href="#carte" icon="arrow" iconPosition="end" data-magnetic>
              Découvrir la carte
            </Button>
          </span>
          <span data-reveal="cta">
            <Button href="#infos" variant="light" icon="map" data-magnetic>
              Nous trouver
            </Button>
          </span>
        </div>
      </div>

      <div className={styles.foot} data-reveal="foot">
        <div className={styles.status}>
          <p className={styles.caption} aria-live="polite">
            {showPhoto ? `La salle · ${restaurant.area}` : useFilm ? 'Film d’ambiance' : ''}
          </p>
          {useFilm &&
            (phase === 'film' ? (
              <button type="button" className={styles.control} onClick={togglePlayback}>
                {paused ? 'Lecture' : 'Pause'}
              </button>
            ) : (
              <button type="button" className={styles.control} onClick={replay}>
                Revoir le film
              </button>
            ))}
        </div>
        <a href="#univers" className={styles.scrollCue}>
          <span>Découvrir</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
