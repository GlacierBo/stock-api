export function formatPrice(price: number): string {
  if (!price) return "--";
  return price.toFixed(2);
}

export function formatPercent(percent: number): string {
  if (!percent) return "0.00%";
  const sign = percent > 0 ? "+" : "";
  return `${sign}${(percent * 100).toFixed(2)}%`;
}

export function getPriceClass(percent: number): string {
  if (percent > 0) return "price-up";
  if (percent < 0) return "price-down";
  return "";
}

export function getPriceBgClass(percent: number): string {
  if (percent > 0) return "price-up-bg";
  if (percent < 0) return "price-down-bg";
  return "";
}
