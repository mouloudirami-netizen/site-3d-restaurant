import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/** Connexion lente ou économiseur de données activé : on évite la vidéo. */
export const prefersLightMedia = () => {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!connection) return false;
  return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType ?? '');
};
