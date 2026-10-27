// Source unique des informations pratiques. Tout élément non confirmé
// est listé dans CONTENT_CHECKLIST.md.

export interface OpeningSlot {
  open: string;
  close: string;
}

export interface OpeningDay {
  label: string;
  /** Jours concernés (0 = dimanche … 6 = samedi). */
  days: number[];
  slots: OpeningSlot[];
  note?: string;
}

export const restaurant = {
  name: 'Helena Restaurant & Café',
  shortName: 'Helena',
  tagline: 'Restaurant · Café · Brunch',
  /** Quartier affiché dans l'accueil (demande du commanditaire), distinct de l'adresse postale. */
  neighborhood: 'Val d’Hydra',
  address: {
    street: '43 Bd du 11 Décembre 1960',
    postalCode: '16100',
    city: 'El Biar',
    country: 'Algérie',
  },
  phone: {
    display: '+213 5 54 06 22 54',
    href: 'tel:+213554062254',
  },
  social: {
    instagram: { url: 'https://www.instagram.com/helena_restaurant_cafe/', handle: '@helena_restaurant_cafe' },
    tiktok: { url: 'https://www.tiktok.com/@helena_restaurant?_r=1&_t=ZS-9AuYy0ihEMX', handle: '@helena_restaurant' },
  },
  // Lien fourni par le commanditaire (voir CONTENT_CHECKLIST.md). `null` masque le bouton « Itinéraire ».
  mapsUrl: 'https://maps.app.goo.gl/jvGTbnBpugh7GLYT6?g_st=iw' as string | null,
  hours: [
    { label: 'Samedi – Jeudi', days: [6, 0, 1, 2, 3, 4], slots: [{ open: '08:00', close: '23:30' }] },
    {
      label: 'Vendredi',
      days: [5],
      slots: [
        { open: '08:00', close: '12:00' },
        { open: '14:00', close: '23:30' },
      ],
      note: 'Fermé de 12 h à 14 h',
    },
  ] satisfies OpeningDay[],
} as const;

export const formatAddress = () => {
  const { street, postalCode, city, country } = restaurant.address;
  return `${street}, ${city} ${postalCode}, ${country}`;
};

// Espaces insécables (+ gluon U+2060 après le tiret) : une plage horaire ne se coupe jamais.
export const formatTime = (time: string) => time.replace(':', '\u00a0h\u00a0');

export const formatSlots = (slots: readonly OpeningSlot[]) =>
  slots.map((slot) => `${formatTime(slot.open)}\u00a0–\u2060\u00a0${formatTime(slot.close)}`).join(' · ');

/** Jour de la semaine actuel à Alger (0 = dimanche). */
export const todayInAlgiers = () => {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Africa/Algiers' }).format(new Date());
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday);
};
