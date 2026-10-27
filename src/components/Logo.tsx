import styles from './Logo.module.css';

interface LogoProps {
  size?: number;
  /** Vide si un texte visible nomme déjà la marque à côté du logo. */
  alt?: string;
  className?: string;
}

// Logo TEMPORAIRE : export basse définition de la couronne HEL&NA.
// À remplacer par le fichier original (SVG/PNG HD) — voir CONTENT_CHECKLIST.md.
export function Logo({ size = 56, alt = 'Helena Restaurant & Café', className }: LogoProps) {
  return (
    <img
      src="/media/logo-temp.webp"
      alt={alt}
      width={size}
      height={size}
      className={[styles.logo, className].filter(Boolean).join(' ')}
      decoding="async"
    />
  );
}
