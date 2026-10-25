import { fetchProducts, renderProductCard } from "./products.js";
import { addToCart, getCurrency, subscribeCart } from "./cart.js";
import { doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showToast } from "./ui.js";

let allProducts = [];
let activeCategory = "All";

export async function initHomePage() {
  const gridEl = document.getElementById("featured-products-grid");
  const searchInput = document.getElementById("home-search-input");
  const categorySlider = document.getElementById("category-slider");
  const promoContainer = document.getElementById("promo-banner-container");

  // Load products
  allProducts = await fetchProducts();
  renderFilteredProducts();

  // Listen for currency changes to re-render prices
  subscribeCart((cart, currency) => {
    renderFilteredProducts();
  });

  // Setup search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderFilteredProducts(q);
    });
  }

  // Setup category chips
  if (categorySlider) {
    categorySlider.addEventListener("click", (e) => {
      const chip = e.target.closest(".category-chip");
      if (!chip) return;
      categorySlider.querySelectorAll(".category-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.category || "All";
      renderFilteredProducts(searchInput ? searchInput.value.toLowerCase().trim() : "");
    });
  }

  // Add to cart delegation
  if (gridEl) {
    gridEl.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-cart-btn");
      if (addBtn && !addBtn.disabled) {
        const prodId = addBtn.dataset.productId;
        const prod = allProducts.find(p => p.id === prodId);
        if (prod) {
          addToCart(prod, 1);
        }
      }
    });
  }

  // Floating Hero Tiles click
  document.querySelectorAll(".hero-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      const cat = tile.dataset.category;
      if (cat && categorySlider) {
        const targetChip = categorySlider.querySelector(`[data-category="${cat}"]`);
        if (targetChip) {
          targetChip.click();
          targetChip.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      }
    });
  });

  // Load Promo Banner from Firestore
  loadPromoBanner(promoContainer);
}

function renderFilteredProducts(searchQuery = "") {
  const gridEl = document.getElementById("featured-products-grid");
  if (!gridEl) return;

  const currentCurrency = getCurrency();
  let list = allProducts;

  if (activeCategory && activeCategory !== "All") {
    list = list.filter(p => (p.category || "").toLowerCase() === activeCategory.toLowerCase());
  }

  if (searchQuery) {
    list = list.filter(p => 
      (p.title || "").toLowerCase().includes(searchQuery) ||
      (p.description || "").toLowerCase().includes(searchQuery) ||
      (p.category || "").toLowerCase().includes(searchQuery)
    );
  }

  if (list.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; background: rgba(7, 20, 44, 0.4); border-radius: var(--radius-lg); border: 1px dashed rgba(255, 255, 255, 0.1);">
        <p style="color: #94A3B8; font-size: 1rem; margin-bottom: 8px;">No accounts found for "${searchQuery || activeCategory}"</p>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('home-search-input').value = ''; document.querySelector('.category-chip[data-category=\\'All\\']')?.click();">Clear Filter</button>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = list.map(prod => renderProductCard(prod, currentCurrency)).join("");
}

async function loadPromoBanner(container) {
  if (!container) return;
  try {
    const q = query(collection(db, "promoCodes"), where("active", "==", true));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const promo = snap.docs[0].data();
      container.innerHTML = `
        <div class="promo-card">
          <div class="promo-info">
            <h4>Special Launch Promo</h4>
            <p>Use code for <strong>${promo.discountPct ? promo.discountPct + '% OFF' : '$' + promo.discountFlat + ' OFF'}</strong> on your purchase!</p>
            <span class="promo-code-badge" onclick="navigator.clipboard.writeText('${promo.code}'); alert('Promo code copied!');">${promo.code}</span>
          </div>
          <div style="font-size: 2.2rem;">🎁</div>
        </div>
      `;
      return;
    }
  } catch (err) {
    console.warn("No active promo found or error loading promo:", err);
  }

  // Fallback neutral promo card
  container.innerHTML = `
    <div class="promo-card">
      <div class="promo-info">
        <h4>Instant Premium Delivery</h4>
        <p>Get authentic accounts and licenses delivered immediately upon confirmed payment.</p>
      </div>
      <div style="font-size: 2rem;">⚡</div>
    </div>
  `;
}
