import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Button.module.css';

type Variant = 'primary' | 'outline' | 'light' | 'ghost';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  children: ReactNode;
}

/** Les actions du site sont toutes des liens (ancres, tel:, réseaux). */
export function Button({
  variant = 'primary',
  icon,
  iconPosition = 'start',
  className,
  children,
  ...rest
}: ButtonProps) {
  const external = rest.href.startsWith('http');
  return (
    <a
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {icon && iconPosition === 'start' && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <Icon name={icon} size={18} className={styles.endIcon} />}
    </a>
  );
}
