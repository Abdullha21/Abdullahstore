import { showToast } from "./ui.js";
import { formatMoney } from "./utils.js";
import { requireAuthForOrder } from "./auth.js";

const CART_KEY = "abdullah_store_cart_v1";
const CURRENCY_KEY = "abdullah_store_currency_v1";

let cart = [];
let currentCurrency = "USD";
const listeners = [];

export function initCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch (e) {
    cart = [];
  }

  const savedCurr = localStorage.getItem(CURRENCY_KEY);
  if (savedCurr) {
    currentCurrency = savedCurr;
  }
  notify();
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notify();
}

export function subscribeCart(callback) {
  listeners.push(callback);
  callback(cart, currentCurrency);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function notify() {
  listeners.forEach((cb) => cb(cart, currentCurrency));
}

export function getCart() {
  return cart;
}

export function getCurrency() {
  return currentCurrency;
}

export function setCurrency(currency) {
  currentCurrency = currency;
  localStorage.setItem(CURRENCY_KEY, currency);
  notify();
}

export function addToCart(product, quantity = 1) {
  if (product.stockStatus === "SOLDOUT") {
    showToast("This item is currently sold out", "warning");
    return;
  }

  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      slug: product.slug || product.id,
      image: (product.images && product.images[0]) || "",
      prices: product.prices || { USD: 0 },
      deliveryDays: product.deliveryDays || 0,
      deliveryInfo: product.deliveryInfo || "",
      quantity: quantity
    });
  }

  saveCart();
  showToast(`Added "${product.title}" to cart!`, "success");
}

export function updateQuantity(productId, quantity) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      cart[index].quantity = quantity;
      saveCart();
    }
  }
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  showToast("Item removed from cart", "info");
}

export function clearCart() {
  cart = [];
  saveCart();
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

export function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const price = (item.prices && item.prices[currentCurrency]) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
}

/**
 * Initiates checkout after verifying customer login.
 * "Customer order korte hole login korte Hobe"
 */
export function proceedToCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty", "warning");
    return;
  }

  if (!requireAuthForOrder("/checkout.html")) {
    return;
  }

  window.location.href = "/checkout.html";
}
