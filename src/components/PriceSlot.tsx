import { formatPrice } from '../data/menu'

// Case prix : reste volontairement vide tant que le restaurant n'a pas communiqué ses tarifs.
export function PriceSlot({ price, className = '' }: { price: number | null; className?: string }) {
  const label = formatPrice(price)
  if (label) return <span className={`price-slot ${className}`}>{label}</span>
  return (
    <span className={`price-slot ${className}`} aria-label="Prix à venir" title="Prix à venir">
      <span className="price-slot__value" aria-hidden="true" />
      <span className="price-slot__unit" aria-hidden="true">
        DA
      </span>
    </span>
  )
}
