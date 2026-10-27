import styles from './Logo.module.css';

interface LogoProps {
  size?: number;
  className?: string;
}

// Logo TEMPORAIRE : export basse définition de la couronne HEL&NA.
// À remplacer par le fichier original (SVG/PNG HD) — voir CONTENT_CHECKLIST.md.
export function Logo({ size = 56, className }: LogoProps) {
  return (
    <img
      src="/media/logo-temp.webp"
      alt="Helena Restaurant & Café"
      width={size}
      height={size}
      className={[styles.logo, className].filter(Boolean).join(' ')}
      decoding="async"
    />
  );
}
