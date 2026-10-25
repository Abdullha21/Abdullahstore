import { collection, getDocs, query, where, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { addToCart, getCurrency } from "./cart.js";
import { formatMoney, escapeHtml } from "./utils.js";
import { showToast } from "./ui.js";
import { requireAuthForOrder } from "./auth.js";

// Built-in initial products when Firestore collection is empty
export const DEFAULT_PRODUCTS = [
  {
    id: "x-premium",
    title: "X Premium (Twitter Blue) Subscription",
    slug: "x-premium",
    category: "Social Media",
    description: "Get the verified blue checkmark, prioritize rankings in conversations, edit posts, write 25,000 character posts, format text, and access Creator Subscriptions.",
    images: ["https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80"],
    stockStatus: "AVAILABLE",
    sortOrder: 1,
    isFeatured: true,
    deliveryDays: 0,
    deliveryInfo: "Instant automated credentials delivery to WhatsApp & Email within 5 minutes.",
    prices: { USD: 8.00, NGN: 12000, BTC: 0.00012, USDT: 8.00, ETH: 0.0028 }
  },
  {
    id: "x-premium-plus",
    title: "X Premium Plus Full Access",
    slug: "x-premium-plus",
    category: "Social Media",
    description: "Ad-free experience in For You & Following feeds, largest reply boost, write Articles, Grok AI assistant full access.",
    images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"],
    stockStatus: "AVAILABLE",
    sortOrder: 2,
    isFeatured: true,
    deliveryDays: 0,
    deliveryInfo: "Instant delivery. Full warranty replacement guarantee.",
    prices: { USD: 16.00, NGN: 24000, BTC: 0.00024, USDT: 16.00, ETH: 0.0055 }
  },
  {
    id: "chatgpt-plus",
    title: "OpenAI ChatGPT Plus Account (Private)",
    slug: "chatgpt-plus",
    category: "AI Tools",
    description: "Access GPT-4o, DALL-E 3 image generation, browsing, Advanced Data Analysis, voice mode, and Custom GPTs with highest priority access.",
    images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"],
    stockStatus: "AVAILABLE",
    sortOrder: 3,
    isFeatured: true,
    deliveryDays: 0,
    deliveryInfo: "Direct login credentials or account upgrade. 30 days full warranty.",
    prices: { USD: 20.00, NGN: 30000, BTC: 0.00030, USDT: 20.00, ETH: 0.0070 }
  },
  {
    id: "youtube-premium",
    title: "YouTube Premium & Music Family Slot",
    slug: "youtube-premium",
    category: "Streaming",
    description: "Ad-free YouTube videos, background playback on mobile, offline downloads, and full YouTube Music Premium included.",
    images: ["https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80"],
    stockStatus: "AVAILABLE",
    sortOrder: 4,
    isFeatured: true,
    deliveryDays: 0,
    deliveryInfo: "Email invitation directly sent to your personal Google account. 100% genuine.",
    prices: { USD: 4.50, NGN: 6800, BTC: 0.00007, USDT: 4.50, ETH: 0.0016 }
  },
  {
    id: "canva-pro",
    title: "Canva Pro Educational / Lifetime Access",
    slug: "canva-pro",
    category: "Design Tools",
    description: "100M+ premium stock photos, videos, audio and graphics. Magic Studio AI tools, background remover, brand kits, and 1TB cloud storage.",
    images: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80"],
    stockStatus: "AVAILABLE",
    sortOrder: 5,
    isFeatured: true,
    deliveryDays: 0,
    deliveryInfo: "Immediate team invite link sent via WhatsApp and displayed on invoice.",
    prices: { USD: 5.00, NGN: 7500, BTC: 0.00008, USDT: 5.00, ETH: 0.0017 }
  },
  {
    id: "nordvpn-complete",
    title: "NordVPN Complete 1-Year Protection",
    slug: "nordvpn-complete",
    category: "VPN",
    description: "Ultra-fast VPN with 6000+ servers worldwide, Threat Protection malware blocker, Cross-platform password manager, and 1TB encrypted cloud storage.",
    images: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"],
    stockStatus: "AVAILABLE",
    sortOrder: 6,
    isFeatured: true,
    deliveryDays: 0,
    deliveryInfo: "Private account credentials with active 12-month subscription.",
    prices: { USD: 15.00, NGN: 22500, BTC: 0.00022, USDT: 15.00, ETH: 0.0052 }
  }
];

export async function fetchProducts() {
  try {
    const colRef = collection(db, "products");
    const q = query(colRef, orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn("Firestore fetch products failed, using default catalog:", err);
  }
  return DEFAULT_PRODUCTS;
}

export async function getProductById(id) {
  try {
    const docRef = doc(db, "products", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn("Firestore fetch single product failed:", err);
  }
  return DEFAULT_PRODUCTS.find(p => p.id === id || p.slug === id) || null;
}

export function renderProductCard(product, currentCurrency = "USD") {
  const price = product.prices?.[currentCurrency];
  const isAvailable = product.stockStatus !== "SOLDOUT";
  const image = (product.images && product.images[0]) || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80";
  const priceText = price !== undefined ? formatMoney(price, currentCurrency) : "Unavailable in " + currentCurrency;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        <img class="product-img" src="${image}" alt="${escapeHtml(product.title)}" loading="lazy" />
        <div class="product-top-badge">
          ${product.isFeatured ? '<span class="badge badge-featured">Featured</span>' : ''}
          <span class="badge ${isAvailable ? 'badge-available' : 'badge-soldout'}">
            ${isAvailable ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
        <button class="favorite-btn" onclick="this.classList.toggle('favorited');" title="Add to Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div class="product-content">
        <span class="product-category-tag">${escapeHtml(product.category || 'Digital Account')}</span>
        <a href="/product-details.html?id=${product.id}">
          <h3 class="product-title">${escapeHtml(product.title)}</h3>
        </a>
        <p class="product-desc">${escapeHtml(product.description || '')}</p>
        
        <div class="product-meta-row">
          <div class="price-display">
            <span class="price-current">${priceText}</span>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn btn-primary btn-sm btn-block add-cart-btn" data-product-id="${product.id}" ${!isAvailable ? 'disabled' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            ${isAvailable ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  `;
}
