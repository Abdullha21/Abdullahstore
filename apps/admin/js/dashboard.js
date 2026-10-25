import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";

export async function loadDashboardMetrics() {
  const totalOrdersEl = document.getElementById("stat-total-orders");
  const pendingOrdersEl = document.getElementById("stat-pending-orders");
  const revenueEl = document.getElementById("stat-revenue");
  const soldoutEl = document.getElementById("stat-soldout");
  const recentOrdersTbody = document.getElementById("recent-orders-tbody");

  let orders = [];
  try {
    const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(20)));
    orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("Using sample metrics:", err);
  }

  // Count metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.orderStatus === "PENDING" || o.paymentStatus === "PENDING").length;
  
  // Calculate revenue grouped by currency to avoid combining unconverted values
  const revByCurr = {};
  orders.filter(o => o.paymentStatus === "PAID").forEach(o => {
    const c = o.currency || "USD";
    revByCurr[c] = (revByCurr[c] || 0) + (o.total || 0);
  });

  const revText = Object.keys(revByCurr).length > 0 
    ? Object.entries(revByCurr).map(([c, amt]) => `${c} ${amt.toLocaleString()}`).join(" | ")
    : "$0.00";

  if (totalOrdersEl) totalOrdersEl.textContent = totalCount;
  if (pendingOrdersEl) pendingOrdersEl.textContent = pendingCount;
  if (revenueEl) revenueEl.textContent = revText;

  // Products sold out count
  try {
    const prodSnap = await getDocs(collection(db, "products"));
    const soldout = prodSnap.docs.filter(d => d.data().stockStatus === "SOLDOUT").length;
    if (soldoutEl) soldoutEl.textContent = soldout;
  } catch (e) {
    if (soldoutEl) soldoutEl.textContent = "0";
  }

  // Render recent orders table
  if (recentOrdersTbody) {
    if (orders.length === 0) {
      recentOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 24px;">No orders placed yet.</td></tr>`;
      return;
    }

    recentOrdersTbody.innerHTML = orders.map(ord => `
      <tr>
        <td style="font-weight: 700; color: #FFFFFF;">${ord.orderNumber || ord.id.slice(0, 8)}</td>
        <td>
          <div style="font-weight: 600;">${ord.customer?.name || "Customer"}</div>
          <div style="font-size: 0.75rem; color: #64748B;">${ord.customer?.email || ""}</div>
        </td>
        <td style="font-weight: 700; color: var(--neon-cyan);">${ord.currency || '$'} ${(ord.total || 0).toLocaleString()}</td>
        <td><span class="badge ${ord.paymentStatus === 'PAID' ? 'badge-available' : 'badge-soldout'}">${ord.paymentStatus || 'PENDING'}</span></td>
        <td><span class="badge ${ord.orderStatus === 'COMPLETED' ? 'badge-available' : 'badge-featured'}">${ord.orderStatus || 'PENDING'}</span></td>
        <td>
          <a href="/invoice.html?token=${ord.shareToken}" target="_blank" class="btn btn-secondary btn-sm">Invoice</a>
        </td>
      </tr>
    `).join("");
  }
}
