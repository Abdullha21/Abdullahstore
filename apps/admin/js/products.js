import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function loadAdminProducts() {
  const tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px;">No products found. Click "Add New Product" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = snap.docs.map(d => {
      const p = d.data();
      const id = d.id;
      const isAvailable = p.stockStatus !== "SOLDOUT";
      const usdPrice = p.prices?.USD !== undefined ? `$${p.prices.USD}` : "-";
      const ngnPrice = p.prices?.NGN !== undefined ? `₦${p.prices.NGN}` : "-";

      return `
        <tr>
          <td><img src="${(p.images && p.images[0]) || ''}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" alt="" /></td>
          <td>
            <div style="font-weight: 700; color: #FFFFFF;">${p.title}</div>
            <div style="font-size: 0.75rem; color: #64748B;">Category: ${p.category || 'General'}</div>
          </td>
          <td>
            <div style="font-weight: 600;">${usdPrice}</div>
            <div style="font-size: 0.75rem; color: #94A3B8;">${ngnPrice}</div>
          </td>
          <td>
            <button class="badge ${isAvailable ? 'badge-available' : 'badge-soldout'}" onclick="window.toggleStock('${id}', '${p.stockStatus}')">
              ${isAvailable ? 'AVAILABLE' : 'SOLDOUT'}
            </button>
          </td>
          <td>${p.isFeatured ? '<span class="badge badge-featured">Featured</span>' : 'No'}</td>
          <td>
            <div class="table-actions">
              <a href="/admin/product-form.html?id=${id}" class="btn btn-secondary btn-sm">Edit</a>
              <button class="btn btn-secondary btn-sm" style="color: var(--danger);" onclick="window.deleteProduct('${id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Load products failed:", err);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger); padding: 20px;">Failed to load products.</td></tr>`;
  }
}

window.toggleStock = async (id, currentStatus) => {
  const newStatus = currentStatus === "SOLDOUT" ? "AVAILABLE" : "SOLDOUT";
  try {
    await updateDoc(doc(db, "products", id), { stockStatus: newStatus });
    showAdminToast(`Product stock set to ${newStatus}`, "success");
    loadAdminProducts();
  } catch (e) {
    showAdminToast("Stock update failed", "error");
  }
};

window.deleteProduct = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) return;
  try {
    await deleteDoc(doc(db, "products", id));
    showAdminToast("Product deleted successfully", "info");
    loadAdminProducts();
  } catch (e) {
    showAdminToast("Delete failed", "error");
  }
};
