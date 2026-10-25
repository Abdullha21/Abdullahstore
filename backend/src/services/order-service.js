import { adminDb } from "../firebase-admin.js";
import { generateOrderNumber, generateInvoiceNumber, generateShareToken } from "../utils/ids.js";
import { roundMoney } from "../utils/money.js";
import { validatePromoCode } from "./promo-service.js";

// Canonical product catalog used for authoritative price verification
const PRODUCT_PRICES = {
  "x-premium": { title: "X Premium (Twitter Blue) Subscription", prices: { USD: 8.00, NGN: 12000, BTC: 0.00012, USDT: 8.00, ETH: 0.0028 } },
  "x-premium-plus": { title: "X Premium Plus Full Access", prices: { USD: 16.00, NGN: 24000, BTC: 0.00024, USDT: 16.00, ETH: 0.0055 } },
  "chatgpt-plus": { title: "OpenAI ChatGPT Plus Account (Private)", prices: { USD: 20.00, NGN: 30000, BTC: 0.00030, USDT: 20.00, ETH: 0.0070 } },
  "youtube-premium": { title: "YouTube Premium & Music Family Slot", prices: { USD: 4.50, NGN: 6800, BTC: 0.00007, USDT: 4.50, ETH: 0.0016 } },
  "canva-pro": { title: "Canva Pro Educational / Lifetime Access", prices: { USD: 5.00, NGN: 7500, BTC: 0.00008, USDT: 5.00, ETH: 0.0017 } },
  "nordvpn-complete": { title: "NordVPN Complete 1-Year Protection", prices: { USD: 15.00, NGN: 22500, BTC: 0.00022, USDT: 15.00, ETH: 0.0052 } }
};

export async function processOrderCreation(data) {
  const { customer, items, currency = "USD", promoCode, paymentMethod, userId } = data;

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = PRODUCT_PRICES[item.id] || { title: item.title || "Digital Goods", prices: { [currency]: 10.00 } };
    const unitPrice = product.prices[currency] || 10.00;
    const lineTotal = roundMoney(unitPrice * item.quantity, currency);
    subtotal += lineTotal;

    verifiedItems.push({
      id: item.id,
      title: product.title,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      deliveryInfo: "Instant automated credentials dispatch"
    });
  }

  subtotal = roundMoney(subtotal, currency);

  let discount = 0;
  if (promoCode) {
    const promoRes = validatePromoCode(promoCode, subtotal, currency);
    if (promoRes.valid) {
      discount = roundMoney(promoRes.discount, currency);
      adminDb.promoCodes.updateUsage(promoCode);
    }
  }

  const total = roundMoney(Math.max(0, subtotal - discount), currency);
  const orderNumber = generateOrderNumber();
  const invoiceNo = generateInvoiceNumber();
  const shareToken = generateShareToken();

  const orderRecord = {
    orderNumber,
    invoiceNo,
    shareToken,
    userId: userId || null,
    customer,
    items: verifiedItems,
    subtotal,
    discount,
    total,
    currency,
    promoCode: promoCode || null,
    paymentMethod,
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    createdAt: new Date().toISOString()
  };

  adminDb.orders.set(orderNumber, orderRecord);

  // Create admin notification
  adminDb.notifications.add({
    target: "ADMIN",
    title: `New Order #${orderNumber}`,
    body: `${customer.name} placed an order for ${currency} ${total}`,
    link: `/invoice.html?token=${shareToken}`,
    read: false,
    createdAt: new Date().toISOString()
  });

  return {
    success: true,
    orderNumber,
    invoiceNo,
    shareToken,
    total,
    currency
  };
}
