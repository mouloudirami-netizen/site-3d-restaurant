// Restaurants : horaires et téléphones relevés sur les visuels officiels fournis par le client.
// Les adresses exactes ne sont pas encore validées : le bouton « Itinéraire » ouvre la recherche
// Google Maps correspondante. Remplacer `mapsUrl` par le lien de partage de la fiche officielle.

// Jours : 0 = dimanche … 6 = samedi (comme Date.getDay()).
export type Slot = { days: number[]; open: string; close: string }

export type Restaurant = {
  id: string
  name: string
  phoneDisplay: string
  phone: string
  slots: Slot[]
  mapsUrl: string
  address: string | null
}

const SUN_THU = [0, 1, 2, 3, 4]
const SAT_THU = [6, 0, 1, 2, 3, 4]
const FRI = [5]
const SAT = [6]

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Thaisty Crousty ${q} Alger`)}`

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'draria',
    name: 'Draria',
    phoneDisplay: '06 97 64 55 46',
    phone: '+213697645546',
    slots: [
      { days: SAT_THU, open: '11:30', close: '02:00' },
      { days: FRI, open: '18:00', close: '02:00' },
    ],
    mapsUrl: maps('Draria'),
    address: null,
  },
  {
    id: 'mohammadia',
    name: 'Mohammadia',
    phoneDisplay: '0562 72 44 29',
    phone: '+213562724429',
    slots: [
      { days: SAT_THU, open: '11:00', close: '02:00' },
      { days: FRI, open: '17:00', close: '02:00' },
    ],
    mapsUrl: maps('Mohammadia'),
    address: null,
  },
  {
    id: 'cheraga',
    name: 'Cheraga',
    phoneDisplay: '0540 46 75 00',
    phone: '+213540467500',
    slots: [
      { days: SUN_THU, open: '11:00', close: '02:00' },
      { days: FRI, open: '18:00', close: '03:00' },
      { days: SAT, open: '11:00', close: '03:00' },
    ],
    mapsUrl: maps('Cheraga'),
    address: null,
  },
  {
    id: 'sidi-yahia',
    name: 'Sidi Yahia',
    phoneDisplay: '0793 75 57 88',
    phone: '+213793755788',
    slots: [
      { days: SUN_THU, open: '11:30', close: '02:00' },
      { days: FRI, open: '18:00', close: '03:00' },
      { days: SAT, open: '11:30', close: '03:00' },
    ],
    mapsUrl: maps('Sidi Yahia'),
    address: null,
  },
  {
    id: 'dely-brahim',
    name: 'Dely Brahim',
    phoneDisplay: '0563 12 35 23',
    phone: '+213563123523',
    slots: [
      { days: SUN_THU, open: '11:30', close: '02:00' },
      { days: FRI, open: '18:00', close: '03:00' },
      { days: SAT, open: '11:30', close: '03:00' },
    ],
    mapsUrl: maps('Dely Brahim'),
    address: null,
  },
  {
    id: 'draria-el-yasmine',
    name: 'Draria El Yasmine',
    phoneDisplay: '0542 77 93 17',
    phone: '+213542779317',
    slots: [
      { days: SUN_THU, open: '11:00', close: '01:00' },
      { days: FRI, open: '18:00', close: '02:00' },
      { days: SAT, open: '11:00', close: '01:00' },
    ],
    mapsUrl: maps('Draria El Yasmine'),
    address: null,
  },
  {
    id: 'bab-ezzouar',
    name: 'Bab Ezzouar',
    phoneDisplay: '0542 21 61 47',
    phone: '+213542216147',
    slots: [
      { days: SUN_THU, open: '11:30', close: '03:00' },
      { days: FRI, open: '18:00', close: '04:00' },
      { days: SAT, open: '11:30', close: '04:00' },
    ],
    mapsUrl: maps('Bab Ezzouar'),
    address: null,
  },
  {
    id: 'ain-allah',
    name: 'Aïn Allah',
    phoneDisplay: '0563 76 02 40',
    phone: '+213563760240',
    slots: [
      { days: SUN_THU, open: '11:00', close: '05:00' },
      { days: FRI, open: '18:00', close: '05:00' },
      { days: SAT, open: '11:00', close: '05:00' },
    ],
    mapsUrl: maps('Ain Allah Dely Brahim'),
    address: null,
  },
]

export const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
