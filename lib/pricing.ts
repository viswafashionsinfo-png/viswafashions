// Must match the orders_quantity_range check in supabase/product-detail.sql.
export const MAX_ORDER_QUANTITY = 10;

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_ORDER_QUANTITY, Math.max(1, Math.floor(value)));
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function discountPercent(price: number, originalPrice: number | null): number | null {
  if (originalPrice == null || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}
