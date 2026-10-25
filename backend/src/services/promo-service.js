import { adminDb } from "../firebase-admin.js";

export function validatePromoCode(code, subtotal, currency = "USD") {
  if (!code) return { valid: false, message: "No code provided" };
  const promo = adminDb.promoCodes.get(code);

  if (!promo || !promo.active) {
    return { valid: false, message: "Invalid or inactive promo code" };
  }

  if (promo.minOrder && subtotal < promo.minOrder) {
    return { valid: false, message: `Minimum order of $${promo.minOrder} required for this code` };
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return { valid: false, message: "Promo code has reached maximum usage limit" };
  }

  let discount = 0;
  if (promo.discountPct) {
    discount = (subtotal * promo.discountPct) / 100;
  } else if (promo.discountFlat) {
    discount = promo.discountFlat;
  }

  return {
    valid: true,
    message: `${promo.discountPct ? promo.discountPct + '%' : '$' + promo.discountFlat} discount applied`,
    discount,
    promo
  };
}
