export function stockTotal(item: { quantity: number; pricePerKg?: number | null }) {
  if (!item.pricePerKg) return item.quantity;
  return item.quantity * item.pricePerKg;
}
