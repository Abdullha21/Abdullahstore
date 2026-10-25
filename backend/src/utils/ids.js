import crypto from "crypto";

export function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `AS-${dateStr}-${randomStr}`;
}

export function generateInvoiceNumber() {
  const dateStr = new Date().toISOString().slice(2, 7).replace(/-/g, "");
  const randomStr = Math.floor(10000 + Math.random() * 90000);
  return `INV-${dateStr}-${randomStr}`;
}

export function generateShareToken() {
  return crypto.randomBytes(24).toString("hex");
}
