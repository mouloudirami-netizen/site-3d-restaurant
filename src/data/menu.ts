// Menu salé : noms et compositions relevés sur les affiches officielles fournies.
// Les prix ne sont pas encore communiqués : `price` reste à `null` et le site affiche une case vide.

export type SauceKey = 'blanche' | 'curry' | 'piquante' | 'sucree'

export type Bowl = {
  id: string
  family: 'crousty' | 'curry'
  kicker: string
  name: string
  composition: string[]
  sauces: SauceKey[]
  price: number | null
  image: string
  tagline: string
}

const img = (id: string) => `/media/bowls/${id}`

export const BOWLS: Bowl[] = [
  {
    id: 'classic',
    family: 'crousty',
    kicker: 'Crousty',
    name: 'Classic',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce blanche', 'Oignons frits', 'Persil'],
    sauces: ['blanche'],
    price: null,
    image: img('classic'),
    tagline: 'La base. Le crousty, la sauce blanche, rien d’autre.',
  },
  {
    id: 'spicy',
    family: 'crousty',
    kicker: 'Crousty',
    name: 'Spicy',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce blanche', 'Sauce piquante', 'Oignons frits', 'Persil'],
    sauces: ['blanche', 'piquante'],
    price: null,
    image: img('spicy'),
    tagline: 'Pour ceux qui aiment quand ça pique.',
  },
  {
    id: 'sweet',
    family: 'crousty',
    kicker: 'Crousty',
    name: 'Sweet',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce blanche', 'Sauce sucrée', 'Oignons frits', 'Persil'],
    sauces: ['blanche', 'sucree'],
    price: null,
    image: img('sweet'),
    tagline: 'Le croustillant, version douce et caramélisée.',
  },
  {
    id: 'mix',
    family: 'crousty',
    kicker: 'Crousty',
    name: 'Mix',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce blanche', 'Sauce sucrée', 'Sauce piquante', 'Oignons frits', 'Persil'],
    sauces: ['blanche', 'sucree', 'piquante'],
    price: null,
    image: img('mix'),
    tagline: 'Sucré, piquant. Pourquoi choisir ?',
  },
  {
    id: 'curry-thai',
    family: 'curry',
    kicker: 'Crousty Curry',
    name: 'Thaï',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce curry', 'Oignons frits', 'Persil'],
    sauces: ['curry'],
    price: null,
    image: img('curry-thai'),
    tagline: 'La sauce curry nappe tout. Littéralement.',
  },
  {
    id: 'curry-spicy',
    family: 'curry',
    kicker: 'Crousty Curry',
    name: 'Spicy',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce curry', 'Sauce piquante', 'Oignons frits', 'Persil'],
    sauces: ['curry', 'piquante'],
    price: null,
    image: img('curry-spicy'),
    tagline: 'Curry et piment, le duo qui chauffe.',
  },
  {
    id: 'curry-sweet',
    family: 'curry',
    kicker: 'Crousty Curry',
    name: 'Sweet',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce curry', 'Sauce sucrée', 'Oignons frits', 'Persil'],
    sauces: ['curry', 'sucree'],
    price: null,
    image: img('curry-sweet'),
    tagline: 'Le curry rencontre le sucré.',
  },
  {
    id: 'curry-mix',
    family: 'curry',
    kicker: 'Crousty Curry',
    name: 'Mix',
    composition: ['Riz blanc', 'Poulet crousty', 'Sauce curry', 'Sauce piquante', 'Sauce sucrée', 'Oignons frits', 'Persil'],
    sauces: ['curry', 'piquante', 'sucree'],
    price: null,
    image: img('curry-mix'),
    tagline: 'Les trois sauces. Le bol complet.',
  },
]

export const FAMILIES = [
  { id: 'crousty', label: 'Crousty', note: 'Base sauce blanche' },
  { id: 'curry', label: 'Crousty Curry', note: 'Base sauce curry' },
] as const

// Suppléments vus sur l'ancien panneau menu ; prix volontairement laissés vides.
export const EXTRAS = [
  { id: 'sauce', name: 'Supplément sauce', price: null as number | null },
  { id: 'poulet', name: 'Supplément poulet', price: null as number | null },
]

export const SAUCE_COLORS: Record<SauceKey, string> = {
  blanche: '#f1ece2',
  curry: '#e2c23c',
  piquante: '#c4261b',
  sucree: '#df6a1e',
}

export const SAUCE_LABELS: Record<SauceKey, string> = {
  blanche: 'Sauce blanche',
  curry: 'Sauce curry',
  piquante: 'Sauce piquante',
  sucree: 'Sauce sucrée',
}

export function formatPrice(price: number | null) {
  return price === null ? null : `${price} DA`
}
