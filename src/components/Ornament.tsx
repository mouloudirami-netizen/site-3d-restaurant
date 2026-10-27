import styles from './Ornament.module.css';

/** Filet fin avec losange central, inspiré des séparateurs du menu Helena. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      className={[styles.ornament, className].filter(Boolean).join(' ')}
      viewBox="0 0 240 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 8h100M140 8h100" />
      <path d="M120 2l6 6-6 6-6-6z" className={styles.diamond} />
      <circle cx="106" cy="8" r="1.4" />
      <circle cx="134" cy="8" r="1.4" />
    </svg>
  );
}
