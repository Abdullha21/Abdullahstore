import { getCart, getCurrency, getCartSubtotal, clearCart } from "./cart.js";
import { auth } from "./firebase.js";
import { formatMoney, escapeHtml } from "./utils.js";
import { showToast } from "./ui.js";
import { requireAuthForOrder } from "./auth.js";

let appliedPromo = null;
let selectedPaymentMethod = "crypto_usdt";

export async function initCheckoutPage() {
  // Check mandatory customer login
  // "Customer order korte hole login korte Hobe"
  if (!requireAuthForOrder("/checkout.html")) {
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty. Please add items to checkout.", "warning");
    setTimeout(() => window.location.href = "/", 1500);
    return;
  }

  // Pre-fill user data if available
  const user = auth.currentUser;
  if (user) {
    const nameField = document.getElementById("customer-name");
    const emailField = document.getElementById("customer-email");
    if (nameField && !nameField.value) nameField.value = user.displayName || "";
    if (emailField && !emailField.value) emailField.value = user.email || "";
  }

  renderCheckoutSummary();
  setupPromoValidator();
  setupPaymentMethods();
  setupFormSubmit();
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const discountEl = document.getElementById("checkout-discount");
  const totalEl = document.getElementById("checkout-total");
  if (!container) return;

  const cart = getCart();
  const currency = getCurrency();
  const subtotal = getCartSubtotal();

  container.innerHTML = cart.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.9rem;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-weight: 700; color: var(--neon-cyan);">${item.quantity}x</span>
        <span>${escapeHtml(item.title)}</span>
      </div>
      <span style="font-weight: 600;">${formatMoney((item.prices?.[currency] || 0) * item.quantity, currency)}</span>
    </div>
  `).join("");

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPct) {
      discount = (subtotal * appliedPromo.discountPct) / 100;
    } else if (appliedPromo.discountFlat) {
      discount = appliedPromo.discountFlat;
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal, currency);
  if (discountEl) discountEl.textContent = discount > 0 ? `-${formatMoney(discount, currency)}` : formatMoney(0, currency);
  if (totalEl) totalEl.textContent = formatMoney(finalTotal, currency);
}

function setupPromoValidator() {
  const applyBtn = document.getElementById("apply-promo-btn");
  const promoInput = document.getElementById("promo-input");
  if (!applyBtn || !promoInput) return;

  applyBtn.addEventListener("click", async () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) return;

    applyBtn.disabled = true;
    applyBtn.textContent = "Verifying...";

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: getCartSubtotal(), currency: getCurrency() })
      });
      const data = await response.json();
      if (response.ok && data.valid) {
        appliedPromo = data.promo;
        showToast(`Promo "${code}" applied: ${data.message}`, "success");
        renderCheckoutSummary();
      } else {
        showToast(data.message || "Invalid or expired promo code", "error");
        appliedPromo = null;
        renderCheckoutSummary();
      }
    } catch (err) {
      showToast("Error checking promo code", "error");
    } finally {
      applyBtn.disabled = false;
      applyBtn.textContent = "Apply";
    }
  });
}

function setupPaymentMethods() {
  const methodCards = document.querySelectorAll(".payment-method-card");
  methodCards.forEach(card => {
    card.addEventListener("click", () => {
      methodCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedPaymentMethod = card.dataset.method;
      updatePaymentInstructions(selectedPaymentMethod);
    });
  });
  updatePaymentInstructions(selectedPaymentMethod);
}

function updatePaymentInstructions(method) {
  const box = document.getElementById("payment-instructions-area");
  if (!box) return;

  if (method === "crypto_usdt") {
    box.innerHTML = `
      <div class="payment-instructions-box">
        <h4 style="font-weight: 700; color: var(--neon-cyan); margin-bottom: 8px;">USDT (TRC-20) Payment Details</h4>
        <p style="font-size: 0.82rem; color: #94A3B8; margin-bottom: 12px;">Transfer the total amount to the verified store wallet below:</p>
        <div style="background: #030817; padding: 10px 14px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1);">
          <span id="wallet-addr">TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE</span>
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE'); alert('Wallet address copied!');">Copy</button>
        </div>
        <div class="qr-wrapper">
          <img class="qr-code-img" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE" alt="USDT QR Code" />
        </div>
      </div>
    `;
  } else if (method === "crypto_btc") {
    box.innerHTML = `
      <div class="payment-instructions-box">
        <h4 style="font-weight: 700; color: #F59E0B; margin-bottom: 8px;">Bitcoin (BTC) Payment Details</h4>
        <div style="background: #030817; padding: 10px 14px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1);">
          <span>bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span>
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'); alert('BTC address copied!');">Copy</button>
        </div>
        <div class="qr-wrapper">
          <img class="qr-code-img" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" alt="BTC QR Code" />
        </div>
      </div>
    `;
  } else {
    box.innerHTML = `
      <div class="payment-instructions-box">
        <h4 style="font-weight: 700; color: #34D399; margin-bottom: 8px;">Direct Bank Transfer / Wire</h4>
        <p style="font-size: 0.82rem; color: #94A3B8; margin-bottom: 10px;">Send transfer with your Order ID as reference:</p>
        <div style="font-size: 0.88rem; line-height: 1.6; color: #E2E8F0;">
          <div><strong>Bank Name:</strong> ABDULLAH GLOBAL COMMERCE</div>
          <div><strong>Account Name:</strong> MD ABDULLAH DIGITAL STORE</div>
          <div><strong>Account Number:</strong> 0192837465</div>
        </div>
      </div>
    `;
  }
}

function setupFormSubmit() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Re-verify login status
    if (!auth.currentUser) {
      showToast("Authentication required to complete order", "error");
      requireAuthForOrder("/checkout.html");
      return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const whatsapp = document.getElementById("customer-whatsapp").value.trim();
    const deliveryInfo = document.getElementById("customer-delivery-notes").value.trim();

    if (!name || !email || !whatsapp) {
      showToast("Please fill in all required customer details", "warning");
      return;
    }

    const submitBtn = document.getElementById("place-order-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing Order...";

    try {
      const idToken = await auth.currentUser.getIdToken();
      const payload = {
        idempotencyKey: "ord_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
        userId: auth.currentUser.uid,
        customer: { name, email, whatsapp, deliveryInfo },
        items: getCart().map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity
        })),
        currency: getCurrency(),
        promoCode: appliedPromo ? appliedPromo.code : null,
        paymentMethod: selectedPaymentMethod
      };

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Order creation failed");
      }

      clearCart();
      showToast("Order placed successfully!", "success");
      window.location.href = `/thank-you.html?orderId=${resData.orderNumber}&token=${resData.shareToken}`;
    } catch (err) {
      showToast(err.message || "Could not place order", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Complete Order";
    }
  });
}
