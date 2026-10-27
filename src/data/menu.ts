// Carte Helena, transcrite depuis les pages du menu (media-source/menu/page-XX.jpg).
// Règles : prix et contenus fidèles au menu ; seules les fautes d'orthographe
// évidentes sont corrigées (liste dans MENU_VERIFICATION.md).
// Prix en DA ; `null` = prix non renseigné sur le menu (jamais estimé).

export interface MenuItem {
  name: string;
  price: number | null;
  description?: string;
  /** Composition d'une formule (brunch). */
  includes?: string[];
  note?: string;
}

export interface Supplement {
  name: string;
  price?: number;
}

export interface SupplementGroup {
  title: string;
  items: Supplement[];
}

export interface MenuSection {
  id: string;
  title: string;
  /** Précision figurant sur le menu (ex. « Selon arrivage »). */
  subtitle?: string;
  items: MenuItem[];
  supplements?: SupplementGroup[];
  note?: string;
  /** Libellé affiché à la place d'un prix absent. */
  missingPriceLabel?: string;
}

export interface MenuGroup {
  id: 'brunch' | 'cuisine' | 'boissons' | 'douceurs';
  label: string;
  /** Mot calligraphié décoratif. */
  script: string;
  intro: string;
  sections: MenuSection[];
}

const names = (...list: string[]): Supplement[] => list.map((name) => ({ name }));

const SAUCES_AU_CHOIX = 'Sauce au choix : chocolat, pistache, caramel beurre salé, miel, confiture, beurre';
const SAUCES_AU_CHOIX_PATE = 'Sauce au choix : chocolat, pâte pistache, caramel beurre salé, miel, confiture, beurre';
const DESSERT_SUPPLEMENTS: SupplementGroup[] = [
  { title: 'Suppléments', items: [{ name: 'Crème chantilly', price: 150 }, { name: 'Glaces', price: 300 }] },
];
const DRINK_SUPPLEMENTS: SupplementGroup[] = [
  { title: 'Suppléments', items: names('Milk', 'Honey', 'Brown sugar', 'Whipped cream', 'Fruits') },
];
const MOJITO_BASE = 'Mint, lemon, sugar, ice, sparkling water';

/* ------------------------------------------------------------------ */
/* Brunch — pages 01 à 03                                              */
/* ------------------------------------------------------------------ */

export const brunchFormulas: MenuSection = {
  id: 'formules-brunch',
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
    { title: 'Suppléments sucrés', items: names('Fruits de saison', 'Fruits secs', 'Miel', 'Sirop d’érable') },
    { title: 'Sauces', items: names('Chocolat', 'Pistache', 'Caramel', 'Beurre salé') },
    {
      title: 'Suppléments salés',
      items: names('Bacon de bœuf', 'Saucisse royale', 'Champignons frais', 'Pain complet', 'Saumon fumé', 'Avocat', 'Fromage'),
    },
    { title: 'Charcuterie, œufs', items: names('Poché', 'Dur', 'Brouillé', 'Au plat') },
  ],
  note: 'Prix des suppléments : nous consulter.',
};

/* ------------------------------------------------------------------ */
/* Cuisine — pages 04 à 09                                             */
/* ------------------------------------------------------------------ */

const entreesFroides: MenuSection = {
  id: 'entrees-froides',
  title: 'Entrées froides',
  items: [
    { name: 'Salade de pâtes à la grecque', price: 1000 },
    { name: 'Salade niçoise', price: 1200 },
    { name: 'Salade César', price: 1200 },
    { name: 'Salade Caprese aux anchois', price: 1400 },
    { name: 'Salade de poulpe', price: 1500 },
    { name: 'Burrata au pesto', price: 1600 },
    { name: 'Assiette de fromage', price: 1600 },
    { name: 'Salade avocat saumon', price: 1600 },
    { name: 'Salade Hel&Na', price: 2000, description: 'Crevettes, saumon fumé, avocat, crudités, fromage' },
  ],
};

const entreesChaudes: MenuSection = {
  id: 'entrees-chaudes',
  title: 'Entrées chaudes',
  items: [
    { name: 'Soupe du jour', price: 800 },
    { name: 'Camembert pané', price: 1200 },
    { name: 'Camembert au four', price: 1200 },
    {
      name: 'Crevettes tempura',
      price: 2400,
      description: 'Crevettes croustillantes enrobées d’une pâte légère, servies avec une sauce savoureuse',
    },
  ],
};

const tartines: MenuSection = {
  id: 'tartines',
  title: 'Tartines',
  items: [
    {
      name: 'Tomate & Mozzarella',
      price: 1000,
      description: 'Pain single, fromage tartine, tomate, mozzarella, sauce pesto, accompagné d’un bouquet de salade',
    },
    {
      name: 'Avocat & Œuf poché',
      price: 1300,
      description: 'Fromage tartine, avocat, œuf poché, garniture de salade verte, tomates cerises et cornichons',
    },
    {
      name: 'Chèvre & Miel',
      price: 1400,
      description: 'Fromage tartine, chèvre, miel, noix, garniture de salade verte, tomates cerises et cornichons',
    },
    {
      name: 'Tartine du chef',
      price: 1400,
      description: 'Pain single, aubergine, oignons caramélisés, champignons sautés, gratinée',
    },
    {
      name: 'Avocat & Saumon fumé',
      price: 1600,
      description: 'Fromage tartine, mousse d’avocat, saumon fumé, garniture de salade verte, tomates cerises et cornichons',
    },
    {
      name: 'Burrata',
      price: 1600,
      description: 'Fromage italien, burrata, tomates, salade verte, sauce cerise coriandre',
    },
  ],
  note: 'Pain single et bouquet de salade servis avec toutes les tartines.',
};

const burgers: MenuSection = {
  id: 'burgers',
  title: 'Burgers',
  items: [
    { name: 'Burger Classic', price: 1200, description: '150 g de viande, tomate, cornichon, salade, sauce, fromage' },
    { name: 'Chicken Burger', price: 1200, description: 'Poulet pané, tomate, salade, sauce fromagère' },
    {
      name: 'Burger Buffalo',
      price: 1400,
      description: '150 g de viande / poulet rôti, tomate, cornichon, salade, sauce, fromage',
    },
    {
      name: 'Rustique Burger',
      price: 1400,
      description: '150 g de viande, tomate, salade, sauce fromagère, oignon caramélisé, champignon',
    },
    { name: 'Burger Hel&Na', price: 1600, description: 'Filet de bœuf, tomate, salade, sauce Helena' },
  ],
};

const gratins: MenuSection = {
  id: 'gratins',
  title: 'Gratins',
  items: [
    { name: 'Gratin poulet', price: 1300 },
    { name: 'Gratin viande hachée', price: 1500 },
    { name: 'Gratin crevettes', price: 1800 },
    { name: 'Gratin fruits de mer', price: 2000 },
  ],
};

const viandes: MenuSection = {
  id: 'viandes',
  title: 'Viandes',
  subtitle: 'The Main Dish',
  items: [
    { name: 'Entrecôte grillée', price: 2200 },
    { name: 'Piccata de bœuf', price: 2500, description: 'Émincé de bœuf nappé d’une sauce citronnée aux câpres' },
    { name: 'Assiette Bouché', price: 2800, description: 'Kafta, merguez, poulet, veau' },
    { name: 'Bœuf fondant au fromage', price: 2800, description: 'Tranche de bœuf gratinée aux 3 fromages' },
    { name: 'Filet grillé à la plancha', price: 3200 },
    { name: 'Osso buco méditerranéen', price: 3400 },
    { name: 'Méchoui d’agneau', price: 3800 },
  ],
  note: 'Tous les plats sont accompagnés de 3 garnitures du jour.',
};

const poulet: MenuSection = {
  id: 'poulet',
  title: 'Poulet',
  subtitle: 'The Main Dish',
  items: [
    { name: 'Cuisse de poulet marinée', price: 1500 },
    { name: 'Émincé de poulet au curry', price: 1800 },
    { name: 'Chicken Crispy', price: 1800 },
    { name: 'Escalope florentine', price: 2000, description: 'Suprême de poulet, béchamel aux épinards, fromage gratiné' },
    { name: 'Escalope normande', price: 2000, description: 'Suprême de poulet, sauce champignons, fromage' },
    { name: 'Jurassienne', price: 2000, description: 'Suprême de poulet gratiné, 3 fromages' },
    {
      name: 'Escalope parmigiana',
      price: 2000,
      description: 'Suprême de poulet pané, tranche d’aubergine gratinée aux fromages',
    },
    {
      name: 'Bolognaise',
      price: 2200,
      description: 'Escalope garnie de viande hachée à la sauce tomate, gratinée au fromage',
    },
  ],
  note: 'Tous les plats sont accompagnés de 3 garnitures du jour.',
};

const poissons: MenuSection = {
  id: 'poissons',
  title: 'Poissons',
  subtitle: 'Selon arrivage',
  missingPriceLabel: 'Selon arrivage',
  items: [
    { name: 'Dorade', price: 2500, description: 'Grillée, papillote au four' },
    { name: 'Poulpe à la plancha', price: 2500 },
    { name: 'Espadon', price: 3000, description: 'Pavé grillé, pané, sauce tartare' },
    { name: 'Crevettes royales', price: 4500, description: 'Grillées, en sauce, sautées à l’ail' },
    { name: 'Loup de mer', price: null, description: 'Grillé, farci, mille-feuille' },
    { name: 'Marmelade de poisson', price: null, description: 'Mix de poissons en sauce' },
    { name: 'Tajine de poisson', price: null, description: 'Loup, dorade, espadon, crevettes… mix' },
    { name: 'Assiette pêcheur', price: null, description: 'Mix de poissons grillés' },
    { name: 'Paella (2 personnes)', price: 6000, note: 'Le week-end uniquement' },
  ],
};

const pasta: MenuSection = {
  id: 'pasta',
  title: 'Pâtes',
  items: [
    { name: 'Penne aux quatre fromages', price: 1600 },
    {
      name: 'Tagliatelle rustique',
      price: 1700,
      description: 'Poulet, champignons, crème fraîche, oignons caramélisés',
    },
    { name: 'Spaghetti bolognaise', price: 1700 },
    { name: 'Ravioles ricotta', price: 2000 },
    { name: 'Tagliatelle au saumon', price: 2200 },
    { name: 'Penne aux crevettes', price: 2400 },
    { name: 'Spaghetti aux fruits de mer', price: 2800 },
  ],
};

const woks: MenuSection = {
  id: 'woks',
  title: 'Woks',
  subtitle: 'À base de riz & à base de nouilles',
  items: [
    { name: 'Wok végétarien', price: 1500 },
    { name: 'Chicken Wok', price: 1800 },
    { name: 'Beef Wok', price: 2200 },
    { name: 'Shrimp Wok', price: 2200 },
    { name: 'Wok fruits de mer', price: 2800 },
  ],
};

const menuKids: MenuSection = {
  id: 'menu-kids',
  title: 'Menu Kids',
  subtitle: 'Moins de 12 ans',
  items: [
    { name: 'Pâtes', price: 800, description: 'Sauce rouge / blanche' },
    { name: 'Nuggets & frites', price: 800 },
    { name: 'Burger frites', price: 800, description: 'Poulet pané, viande, ketchup, frites' },
    { name: 'Pizza', price: 800 },
  ],
  note: 'Le menu est servi avec un mini jus.',
};

/* ------------------------------------------------------------------ */
/* Boissons — pages 10, 11 et 13                                            */
/* ------------------------------------------------------------------ */

const coffee: MenuSection = {
  id: 'coffee',
  title: 'Coffee',
  items: [
    { name: 'Coffee', price: 400, description: 'Grain, capsule' },
    { name: 'Cortado', price: 500, description: '50 % espresso, 50 % lait' },
    { name: 'Latte (café au lait)', price: 500 },
    { name: 'Cappuccino', price: 500, description: 'Espresso, lait, avec mousse de lait' },
    { name: 'Pistachio Latte', price: 600, description: 'Espresso, lait, pistache' },
    { name: 'Double Espresso', price: 600 },
    { name: 'Latte Macchiato Flavored', price: 600, description: 'Vanille, noisette, chocolat, caramel' },
    { name: 'Matcha Latte', price: 600, description: 'Matcha, lait' },
    { name: 'Flat White', price: 700, description: 'Double espresso avec lait' },
    { name: 'Spanish Latte', price: 700, description: 'Espresso, milk intense, lait' },
    { name: 'Salted Caramel Latte', price: 700, description: 'Espresso, lait, caramel' },
  ],
};

const brewBar: MenuSection = {
  id: 'brew-bar',
  title: 'Brew Bar',
  items: [
    { name: 'Iced Tea Flavored', price: 600, description: 'Peach, mango, strawberry, mix' },
    { name: 'Iced Latte Flavored', price: 600, description: 'Vanilla, chocolate, caramel, hazelnut' },
    { name: 'Iced Spanish Latte', price: 700 },
    { name: 'Iced Mocha', price: 700 },
    { name: 'Iced Salted Caramel', price: 700 },
    { name: 'Iced Blue Latte', price: 700 },
    { name: 'Iced Latte Pistachio', price: 700 },
    { name: 'Iced Matcha with Mango', price: 800 },
  ],
  supplements: DRINK_SUPPLEMENTS,
};

const tea: MenuSection = {
  id: 'speciality-tea',
  title: 'Speciality Tea',
  items: [
    { name: 'Tea', price: 300 },
    { name: 'Infused Tea', price: 300 },
    { name: 'Tisane bio', price: 300 },
    { name: 'Tea Dried Nuts', price: 700 },
    { name: 'Tea Gourmand', price: 700 },
  ],
};

const hotChocolate: MenuSection = {
  id: 'hot-chocolate',
  title: 'Hot Chocolate',
  items: [
    { name: 'Hot Chocolate', price: 500 },
    { name: 'Chocolate Caramel', price: 500 },
    { name: 'Viennese Chocolate', price: 600 },
    { name: 'Mocaccino', price: 700 },
  ],
};

const softDrinks: MenuSection = {
  id: 'soft-drinks',
  title: 'Soft Drinks',
  items: [
    { name: 'Fresh Water', price: 100 },
    { name: 'Sparkling Water', price: 150 },
    { name: 'Soda', price: 300 },
    { name: 'Diabolo', price: 300 },
  ],
};

const mocktails: MenuSection = {
  id: 'mocktails',
  title: 'Mocktails',
  items: [
    { name: 'Piña Colada', price: 800, description: 'Coconut, ananas, almond milk, shaken with ice' },
    { name: 'Bora-Bora', price: 800, description: 'Ananas, passion fruit, grenadine, shaken with ice' },
    { name: 'Exotic Peach', price: 800, description: 'Peach, mango, apple, shaken with ice' },
    { name: 'Galaxy', price: 900, description: 'Energy drink, blue curaçao, shaken with ice' },
  ],
};

const mojito: MenuSection = {
  id: 'mojito',
  title: 'Mojito',
  items: [
    { name: 'Classic', price: 700, description: MOJITO_BASE },
    { name: 'Mixte', price: 700, description: MOJITO_BASE },
    { name: 'Flavored', price: 800, description: `${MOJITO_BASE}, flavour` },
    { name: 'Energy', price: 900, description: `${MOJITO_BASE}, energy drink` },
  ],
  supplements: DRINK_SUPPLEMENTS,
};

const smoothies: MenuSection = {
  id: 'smoothies',
  title: 'Smoothies',
  items: [
    { name: 'Strawberry', price: 700 },
    { name: 'Strawberry Banana', price: 700 },
    { name: 'Cocktail', price: 750 },
  ],
};

const juices: MenuSection = {
  id: 'juices',
  title: 'Juices',
  items: [
    { name: 'Banana Juice', price: 600 },
    { name: 'Lemon Juice', price: 600 },
    { name: 'Orange Juice', price: 600 },
    { name: 'Strawberry Juice', price: 750 },
    { name: 'Hel&Na Cocktail', price: 750 },
  ],
};

const milkshakes: MenuSection = {
  id: 'milkshakes',
  title: 'Milkshakes',
  items: [
    { name: 'Milkshake Banana', price: 600 },
    { name: 'Milkshake Vanilla', price: 600 },
    { name: 'Milkshake Strawberry', price: 600 },
    { name: 'Milkshake Caramel Beurre Salé', price: 700 },
    { name: 'Milkshake Nutella', price: 900 },
    { name: 'Milkshake Pistachio', price: 900 },
  ],
};

const frappuccino: MenuSection = {
  id: 'frappuccino',
  title: 'Frappuccino',
  items: [
    { name: 'Frappuccino Chocolate', price: 800 },
    { name: 'Frappuccino Caramel Beurre Salé', price: 800 },
    { name: 'Frappuccino Vanilla', price: 800 },
  ],
  supplements: [{ title: 'Supplément au choix', items: names('Nutella', 'Kinder Bueno', 'Oreo', 'Snickers', 'Lotus') }],
};

/* ------------------------------------------------------------------ */
/* Douceurs — pages 12 et 14                                          */
/* ------------------------------------------------------------------ */

const briochePerdue: MenuSection = {
  id: 'brioche-perdue',
  title: 'Brioche perdue',
  items: [
    { name: 'Brioche perdue à la glace', price: 1000, description: SAUCES_AU_CHOIX },
    { name: 'Brioche perdue aux fruits', price: 1200, description: SAUCES_AU_CHOIX_PATE },
    { name: 'Façon tatin (glace vanille)', price: 1200 },
    { name: 'Brioche perdue sirop d’érable', price: 1400 },
  ],
};

const gaufres: MenuSection = {
  id: 'gaufres',
  title: 'Gaufres',
  items: [
    { name: 'Gaufre simple', price: 750, description: SAUCES_AU_CHOIX_PATE },
    { name: 'Gaufre aux fruits de saison', price: 1000, description: SAUCES_AU_CHOIX_PATE },
    { name: 'Gaufre au sirop d’érable & fruits', price: 1200 },
  ],
  supplements: DESSERT_SUPPLEMENTS,
};

const pancakes: MenuSection = {
  id: 'pancakes',
  title: 'Pancakes',
  items: [
    { name: 'Pancake simple', price: 800, description: SAUCES_AU_CHOIX },
    { name: 'Pancake aux fruits', price: 1000, description: SAUCES_AU_CHOIX },
    { name: 'Pancake sirop d’érable & fruits', price: 1200 },
    { name: 'Pancake beurre d’érable & fruits', price: 1200 },
  ],
  supplements: DESSERT_SUPPLEMENTS,
};

const crepes: MenuSection = {
  id: 'crepes',
  title: 'Crêpes',
  items: [
    { name: 'Crêpe simple', price: 750, description: SAUCES_AU_CHOIX_PATE },
    { name: 'Crêpe aux fruits de saison', price: 1000, description: SAUCES_AU_CHOIX_PATE },
    { name: 'Crêpe à la glace', price: 1200, description: 'Sauce au choix' },
  ],
  supplements: DESSERT_SUPPLEMENTS,
};

const coupesGlace: MenuSection = {
  id: 'coupes-de-glace',
  title: 'Coupes de glace',
  items: [
    {
      name: 'Dame blanche',
      price: 1000,
      description: '2 boules de glace brownie, sauce chocolat, nappée de chantilly',
    },
    {
      name: 'Coupe melon fraîcheur',
      price: 1200,
      description: 'Demi-melon, 2 boules (sorbet citron et glace vanille), fruits de saison, chantilly, topping de miel',
    },
    { name: 'Banana split', price: 1200, description: '3 boules de glace au choix, banane, chantilly' },
    {
      name: 'L’Hérisson',
      price: 1600,
      description: '3 boules de glace (chocolat, vanille, caramel), crème chantilly, enrobage d’arachides',
    },
  ],
  supplements: [{ title: 'Supplément', items: [{ name: 'Glace', price: 300 }] }],
  note: 'L’entremets selon arrivage.',
};

const dessertsMaison: MenuSection = {
  id: 'desserts-maison',
  title: 'Desserts maison',
  items: [
    { name: 'Cookie', price: 350 },
    { name: 'Brownies', price: 450 },
    { name: 'Tarte citron', price: 500 },
    { name: 'Flan parisien', price: 500 },
    { name: 'Fondant au chocolat', price: 600 },
    { name: 'Red velvet', price: 600 },
    { name: 'Tarte Bourdaloue', price: 600 },
    { name: 'Tiramisu', price: 600 },
    { name: 'Fondant à la pistache', price: 700 },
    { name: 'Fraisier', price: 700 },
    { name: 'Saint-Sébastien', price: 800, description: 'Sauce chocolat / sauce pistache / crème brûlée' },
    { name: 'Profiteroles', price: 800, description: 'Glace vanille, sauce chocolat' },
    { name: 'Cheese Bomb Dubaï', price: 900 },
  ],
};

/* ------------------------------------------------------------------ */

export const menu: MenuGroup[] = [
  {
    id: 'brunch',
    label: 'Brunch',
    script: 'Brunch',
    intro: 'Quatre formules, de 10 h à 16 h.',
    sections: [brunchFormulas],
  },
  {
    id: 'cuisine',
    label: 'Cuisine',
    script: 'La cuisine',
    intro: 'Entrées, tartines, burgers, plats, poissons, pâtes et woks.',
    sections: [entreesFroides, entreesChaudes, tartines, burgers, gratins, viandes, poulet, poissons, pasta, woks, menuKids],
  },
  {
    id: 'boissons',
    label: 'Boissons',
    script: 'Les boissons',
    intro: 'Cafés, thés, boissons glacées, mocktails, jus et milkshakes.',
    sections: [coffee, brewBar, tea, hotChocolate, softDrinks, mocktails, mojito, smoothies, juices, milkshakes, frappuccino],
  },
  {
    id: 'douceurs',
    label: 'Douceurs',
    script: 'Les douceurs',
    intro: 'Brioches perdues, gaufres, pancakes, crêpes, glaces et desserts maison.',
    sections: [briochePerdue, gaufres, pancakes, crepes, coupesGlace, dessertsMaison],
  },
];
