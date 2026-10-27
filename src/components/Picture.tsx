import type { ImgHTMLAttributes } from 'react';
import { mediaUrl } from '../lib/media';

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Nom de base généré par scripts/optimize-media.sh (ex. « salle-roses »). */
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

const srcSet = (name: string, ext: 'avif' | 'webp') =>
  `${mediaUrl(`${name}-640.${ext}`)} 640w, ${mediaUrl(`${name}-1280.${ext}`)} 1280w`;

/** Image responsive AVIF → WebP, chargement différé par défaut. */
export function Picture({ name, alt, sizes = '100vw', priority = false, ...rest }: PictureProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
      <img
        src={mediaUrl(`${name}-1280.webp`)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        {...rest}
      />
    </picture>
  );
}
