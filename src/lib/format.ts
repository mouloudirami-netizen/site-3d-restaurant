const priceFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/** 1200 → « 1 200 DA » (espaces insécables). */
export const formatPrice = (amount: number) =>
  `${priceFormatter.format(amount).replace(/\s/g, ' ')} DA`;
