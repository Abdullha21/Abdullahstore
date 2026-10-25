import { adminDb } from "../firebase-admin.js";

export function getInvoiceByShareToken(shareToken) {
  if (!shareToken) return null;
  return adminDb.orders.getByToken(shareToken);
}
