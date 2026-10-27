import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { navLinks } from '../data/navigation';
import { restaurant } from '../data/restaurant';
import { useScrolled } from '../hooks/useScrolled';
import { getLenis } from '../hooks/useSmoothScroll';
import { Icon } from './Icon';
import { Logo } from './Logo';
import styles from './Nav.module.css';

export function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.documentElement.style.overflow = 'hidden';
    getLenis()?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className={[styles.nav, solid && styles.solid].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <a href="#accueil" className={styles.brand} onClick={() => setOpen(false)}>
          <Logo size={44} alt="" />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Helena</span>
            <span className={styles.brandSub}>Restaurant &amp; Café</span>
          </span>
        </a>

        <nav aria-label="Navigation principale" className={styles.desktopLinks}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={restaurant.phone.href} className={styles.phone}>
          <Icon name="phone" size={16} />
          <span>{restaurant.phone.display}</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'close' : 'menu'} size={26} />
        </button>
      </div>

      <div id="menu-mobile" className={styles.drawer} data-open={open} hidden={!open}>
        <nav aria-label="Navigation mobile">
          <ul>
            {navLinks.map((link, index) => (
              <li key={link.href} style={{ '--i': index } as CSSProperties}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.drawerFoot}>
          <span className="script">Helena</span>
          <span>{restaurant.tagline}</span>
        </p>
      </div>
    </header>
  );
}
