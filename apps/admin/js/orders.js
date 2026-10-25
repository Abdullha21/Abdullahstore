import { collection, getDocs, doc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function loadAdminOrders() {
  const tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;

  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px;">No customer orders found.</td></tr>`;
      return;
    }

    tbody.innerHTML = snap.docs.map(d => {
      const ord = d.data();
      const id = d.id;
      const curr = ord.currency || "USD";

      return `
        <tr>
          <td><strong style="color: #FFFFFF;">${ord.orderNumber}</strong></td>
          <td>
            <div style="font-weight: 600;">${ord.customer?.name || "Customer"}</div>
            <div style="font-size: 0.75rem; color: #64748B;">${ord.customer?.email || ""}</div>
            <div style="font-size: 0.75rem; color: #94A3B8;">WA: ${ord.customer?.whatsapp || "N/A"}</div>
          </td>
          <td>${(ord.items || []).map(i => `${i.quantity}x ${i.title}`).join(", ")}</td>
          <td style="font-weight: 700; color: var(--neon-cyan);">${curr} ${(ord.total || 0).toLocaleString()}</td>
          <td>
            <select class="form-select" style="padding: 4px 8px; font-size: 0.8rem;" onchange="window.updateOrderStatus('${id}', this.value)">
              <option value="PENDING" ${ord.orderStatus === 'PENDING' ? 'selected' : ''}>PENDING</option>
              <option value="PROCESSING" ${ord.orderStatus === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
              <option value="COMPLETED" ${ord.orderStatus === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
              <option value="CANCELLED" ${ord.orderStatus === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
          </td>
          <td>
            <select class="form-select" style="padding: 4px 8px; font-size: 0.8rem;" onchange="window.updatePaymentStatus('${id}', this.value)">
              <option value="PENDING" ${ord.paymentStatus === 'PENDING' ? 'selected' : ''}>PENDING</option>
              <option value="PAID" ${ord.paymentStatus === 'PAID' ? 'selected' : ''}>PAID</option>
              <option value="FAILED" ${ord.paymentStatus === 'FAILED' ? 'selected' : ''}>FAILED</option>
            </select>
          </td>
          <td>
            <a href="/invoice.html?token=${ord.shareToken}" target="_blank" class="btn btn-secondary btn-sm">Invoice</a>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Failed to load orders:", err);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger); padding: 24px;">Failed to fetch orders.</td></tr>`;
  }
}

window.updateOrderStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, "orders", id), { orderStatus: status });
    showAdminToast(`Order status updated to ${status}`, "success");
  } catch (e) {
    showAdminToast("Order status update failed", "error");
  }
};

window.updatePaymentStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, "orders", id), { paymentStatus: status });
    showAdminToast(`Payment status updated to ${status}`, "success");
  } catch (e) {
    showAdminToast("Payment status update failed", "error");
  }
};
