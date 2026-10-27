// Source unique des informations pratiques. Tout élément non confirmé
// est listé dans CONTENT_CHECKLIST.md.

export interface OpeningSlot {
  open: string;
  close: string;
}

export interface OpeningDay {
  label: string;
  slots: OpeningSlot[];
}

export const restaurant = {
  name: 'Helena Restaurant & Café',
  shortName: 'Helena',
  tagline: 'Restaurant · Café · Brunch',
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
    instagram: 'https://www.instagram.com/helena_restaurant_cafe/',
    tiktok: 'https://www.tiktok.com/@helena_restaurant?_r=1&_t=ZS-9AuYy0ihEMX',
  },
  // À renseigner uniquement avec un lien vérifié (voir CONTENT_CHECKLIST.md).
  mapsUrl: null as string | null,
  hours: [
    { label: 'Samedi – Jeudi', slots: [{ open: '08:00', close: '23:30' }] },
    {
      label: 'Vendredi',
      slots: [
        { open: '08:00', close: '12:00' },
        { open: '14:00', close: '23:30' },
      ],
    },
  ] satisfies OpeningDay[],
  // Information issue du menu, à confirmer (notamment le vendredi).
  brunchHours: { open: '10:00', close: '16:00' },
} as const;

export const formatAddress = () => {
  const { street, postalCode, city, country } = restaurant.address;
  return `${street}, ${city} ${postalCode}, ${country}`;
};

export const formatTime = (time: string) => time.replace(':', ' h ');
