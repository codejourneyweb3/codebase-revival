export function saleTotal(sale: { quantity: number; unitPrice: number }) {
  return sale.quantity * sale.unitPrice;
}
