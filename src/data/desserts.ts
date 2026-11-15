// Gamme « Thaisty Sweety » : noms, formats et couleurs relevés sur les stories Instagram « Desserts ».
// Prix : 500 DA la crème dessert, 400 DA le tiramisu.

export type Dessert = {
  id: string
  range: 'creme' | 'tiramisu'
  name: string
  sub?: string
  weight?: string
  color: string
  ink: string
  price: number | null
}

export const DESSERTS: Dessert[] = [
  { id: 'creme-brulee', range: 'creme', name: 'Crème brûlée', sub: 'Saveur vanille', weight: '120 g', color: '#ec7a2c', ink: '#1a0d05', price: 500 },
  { id: 'pistache', range: 'creme', name: 'Pistache', weight: '170 g', color: '#7ee02a', ink: '#0d1a04', price: 500 },
  { id: 'bounty', range: 'creme', name: 'Bounty', weight: '170 g', color: '#5ec3f2', ink: '#03131c', price: 500 },
  { id: 'raffaello', range: 'creme', name: 'Raffaello', weight: '170 g', color: '#e2262b', ink: '#fff4f0', price: 500 },
  { id: 'ferrero', range: 'creme', name: 'Ferrero', weight: '170 g', color: '#e8b33a', ink: '#1c1203', price: 500 },
  { id: 'nutella', range: 'creme', name: 'Nutella', weight: '170 g', color: '#f4efe6', ink: '#140f0a', price: 500 },
  { id: 'caramel-speculoos', range: 'creme', name: 'Caramel', sub: 'Speculoos', weight: '170 g', color: '#f0973a', ink: '#1c0f03', price: 500 },
  { id: 'bueno', range: 'creme', name: 'Bueno', weight: '170 g', color: '#ee1c1c', ink: '#fff4f0', price: 500 },
  { id: 'snickers', range: 'creme', name: 'Snickers', weight: '170 g', color: '#2f5fe0', ink: '#ffffff', price: 500 },
  { id: 'framboise-pistache', range: 'creme', name: 'Framboise', sub: 'Pistache', weight: '170 g', color: '#ef3a7b', ink: '#1c030c', price: 500 },
  { id: 'tiramisu-bueno', range: 'tiramisu', name: 'Bueno', color: '#ee2a1c', ink: '#fff4f0', price: 400 },
  { id: 'tiramisu-chocolat', range: 'tiramisu', name: 'Chocolat', color: '#f4efe6', ink: '#140f0a', price: 400 },
  { id: 'tiramisu-pistache', range: 'tiramisu', name: 'Pistache', color: '#7ee02a', ink: '#0d1a04', price: 400 },
  { id: 'tiramisu-caramel', range: 'tiramisu', name: 'Caramel', color: '#f0973a', ink: '#1c0f03', price: 400 },
]

export const DESSERT_RANGES = [
  { id: 'creme', label: 'Crème dessert', spaced: 'Crème dessert' },
  { id: 'tiramisu', label: 'Tiramisu', spaced: 'Tiramisu' },
] as const
