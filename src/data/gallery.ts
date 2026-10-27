export interface GalleryImage {
  name: string;
  alt: string;
  caption: string;
}

/** Photographies réelles de Helena (salle et plats). */
export const realPhotos: GalleryImage[] = [
  {
    name: 'salle-roses',
    alt: 'Plafond de roses roses et lustres dorés dans la salle de Helena',
    caption: 'Le plafond de roses',
  },
  {
    name: 'brunch-table',
    alt: 'Table de brunch garnie : tartines, pancakes, granola, cookies et cappuccino',
    caption: 'Le brunch à partager',
  },
  {
    name: 'salle-glycine',
    alt: 'Cascade de glycine blanche et mur de fleurs au-dessus des tables en marbre',
    caption: 'Sous la glycine',
  },
  {
    name: 'pancakes-banane',
    alt: 'Pancakes à la banane caramélisée, orange et sucre glace',
    caption: 'Pancakes, banane & caramel',
  },
  {
    name: 'escalier',
    alt: 'L’escalier fleuri et le comptoir HEL&NA',
    caption: 'L’escalier fleuri',
  },
  {
    name: 'brioche-dattes',
    alt: 'Brioche dorée nappée de dattes caramélisées et de noix',
    caption: 'Dattes caramélisées',
  },
  {
    name: 'smoothie-fraise',
    alt: 'Smoothie à la fraise garni de fruits frais et de menthe',
    caption: 'Smoothie fraise',
  },
];

/** Visuels d'ambiance générés : jamais présentés comme des photos de Helena. */
export const moodImages: GalleryImage[] = [
  { name: 'ambiance-salle', alt: 'Illustration d’ambiance : salle rose sous une voûte de glycine', caption: 'Rêverie florale' },
  { name: 'ambiance-latte', alt: 'Illustration d’ambiance : latte rose, pancakes aux fraises et macarons', caption: 'Douceur rose' },
  { name: 'ambiance-cocktails', alt: 'Illustration d’ambiance : boissons roses garnies de fleurs', caption: 'Heure dorée' },
];
