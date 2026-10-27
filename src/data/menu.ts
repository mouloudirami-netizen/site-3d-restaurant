// Carte Helena, transcrite depuis les pages du menu (media-source/menu/).
// Les points incertains sont listés dans MENU_VERIFICATION.md.
// Prix en DA ; `null` = prix non renseigné sur le menu (jamais estimé).

export interface MenuItem {
  name: string;
  price: number | null;
  description?: string;
  /** Composition d'une formule (brunch). */
  includes?: string[];
  note?: string;
}

export interface SupplementGroup {
  title: string;
  items: string[];
  /** Prix unitaire s'il est indiqué sur le menu. */
  price?: number;
}

export interface MenuSection {
  id: string;
  title: string;
  /** Sous-titre ou précision figurant sur le menu (ex. « Selon arrivage »). */
  subtitle?: string;
  items: MenuItem[];
  supplements?: SupplementGroup[];
  note?: string;
}

export const brunchFormulas: MenuSection = {
  id: 'brunch',
  title: 'Brunch',
  subtitle: 'Formules servies de 10 h 00 à 16 h 00',
  items: [
    {
      name: 'Vibe Brunch',
      price: 2800,
      includes: [
        'Croque-monsieur accompagné d’un bouquet de salade et de frites',
        'Trésor du désert : dattes caramélisées, sauce caramel beurre salé, touche de vanille',
        'Cookie ou croissant pur beurre',
        'Eau PM',
      ],
    },
    {
      name: 'Chill Brunch',
      price: 3000,
      includes: [
        'Crêpe salée gratinée, farce au choix : poulet champignons / viande hachée / crevettes',
        'Pancake façon tatin : cannelle, caramel beurre salé, pomme, boule de glace vanille',
        'Cookie ou croissant pur beurre',
        'Eau PM',
      ],
    },
    {
      name: 'Sunrise Brunch',
      price: 3200,
      includes: [
        'Viennoiserie salée farcie : fromage à tartiner, avocat, saumon, œuf poché, accompagnée d’un bouquet de salade',
        'Granola : yaourt, granola & fruits de saison',
        'Cookie ou croissant pur beurre',
        'Eau PM',
      ],
    },
    {
      name: 'Golden Brunch',
      price: 3800,
      includes: [
        'Trio de tacos mexicains, guacamole d’avocat et crevettes panées',
        'Brioche perdue sirop d’érable et fruits',
        'Cookie ou croissant pur beurre',
        'Eau PM',
      ],
    },
  ],
  supplements: [
    {
      title: 'Suppléments sucrés',
      items: ['Fruits de saison', 'Fruits secs', 'Miel', 'Sirop d’érable'],
    },
    {
      title: 'Sauces',
      items: ['Chocolat', 'Pistache', 'Caramel', 'Beurre salé'],
    },
    {
      title: 'Suppléments salés',
      items: ['Bacon de bœuf', 'Saucisse royale', 'Champignons frais', 'Pain complet', 'Saumon fumé', 'Avocat', 'Fromage'],
    },
    {
      title: 'Charcuterie, œufs',
      items: ['Poché', 'Dur', 'Brouillé', 'Au plat'],
    },
  ],
  note: 'Prix des suppléments : nous consulter.',
};
