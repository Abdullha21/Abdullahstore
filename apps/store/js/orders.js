import { auth, db } from "./firebase.js";
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { formatMoney, escapeHtml } from "./utils.js";
import { showToast } from "./ui.js";

export async function initOrdersPage() {
  const container = document.getElementById("my-orders-list");
  if (!container) return;

  const user = auth.currentUser;
  if (!user) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 16px;">
        <p style="color: #94A3B8; margin-bottom: 16px;">Please log in to view your order history.</p>
        <a href="/login.html?redirect=/my-orders.html" class="btn btn-primary btn-sm">Log In</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div style="text-align: center; padding: 32px;"><span style="color: #94A3B8;">Loading your orders...</span></div>`;

  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; background: rgba(7, 20, 44, 0.4); border-radius: var(--radius-lg); border: 1px dashed rgba(255, 255, 255, 0.1);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📦</div>
          <h3 style="font-size: 1.1rem; color: #FFFFFF; margin-bottom: 6px;">No orders found</h3>
          <p style="color: #94A3B8; font-size: 0.85rem; margin-bottom: 16px;">You haven't placed any orders yet.</p>
          <a href="/products.html" class="btn btn-primary btn-sm">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = snap.docs.map(doc => {
      const ord = doc.data();
      const curr = ord.currency || "USD";
      return `
        <div class="glass-card" style="padding: 18px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-weight: 700; color: #FFFFFF; font-size: 1rem;">Order #${escapeHtml(ord.orderNumber)}</div>
              <div style="font-size: 0.75rem; color: #64748B;">Invoice: #${escapeHtml(ord.invoiceNo || ord.orderNumber)}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge ${ord.orderStatus === 'COMPLETED' ? 'badge-available' : 'badge-featured'}">${escapeHtml(ord.orderStatus || 'PENDING')}</span>
              <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 4px;">Payment: ${escapeHtml(ord.paymentStatus || 'PENDING')}</div>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; margin-bottom: 12px; font-size: 0.85rem; color: #CBD5E1;">
            ${(ord.items || []).map(i => `<div>• ${i.quantity}x ${escapeHtml(i.title)}</div>`).join("")}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
            <div style="font-weight: 800; color: var(--neon-cyan); font-size: 1.1rem;">
              ${formatMoney(ord.total, curr)}
            </div>
            <div style="display: flex; gap: 8px;">
              <a href="/invoice.html?token=${ord.shareToken}" class="btn btn-secondary btn-sm">
                View Invoice
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Orders fetch failed:", err);
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--danger);">Failed to load orders. Please try again.</div>`;
  }
}
