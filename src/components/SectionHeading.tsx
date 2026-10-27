import type { ReactNode } from 'react';
import { Ornament } from './Ornament';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  /** Mot calligraphié affiché au-dessus du titre (comme sur le menu). */
  script?: string;
  title: ReactNode;
  align?: 'center' | 'start';
  tone?: 'dark' | 'light';
}

export function SectionHeading({
  id,
  eyebrow,
  script,
  title,
  align = 'center',
  tone = 'dark',
}: SectionHeadingProps) {
  return (
    <header className={[styles.heading, styles[align], styles[tone]].join(' ')}>
      <p className="eyebrow">{eyebrow}</p>
      {script && (
        <p className={`script ${styles.script}`} aria-hidden="true">
          {script}
        </p>
      )}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      <Ornament className={styles.ornament} />
    </header>
  );
}
