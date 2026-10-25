import { collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function loadAdminPromoCodes() {
  const tbody = document.getElementById("admin-promo-tbody");
  if (!tbody) return;

  try {
    const snap = await getDocs(collection(db, "promoCodes"));
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No promotional codes created yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = snap.docs.map(d => {
      const p = d.data();
      const code = d.id;
      return `
        <tr>
          <td><code style="font-weight: 800; color: var(--neon-cyan);">${code}</code></td>
          <td>${p.discountPct ? p.discountPct + '%' : '$' + (p.discountFlat || 0)}</td>
          <td>$${p.minOrder || 0}</td>
          <td>${p.usedCount || 0} / ${p.maxUses || 'Unlimited'}</td>
          <td><span class="badge ${p.active ? 'badge-available' : 'badge-soldout'}">${p.active ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" style="color: var(--danger);" onclick="window.deletePromo('${code}')">Delete</button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 20px;">Failed to load promos.</td></tr>`;
  }
}

export async function createPromoCode(code, discountPct, minOrder, maxUses) {
  try {
    await setDoc(doc(db, "promoCodes", code.toUpperCase()), {
      code: code.toUpperCase(),
      discountPct: Number(discountPct) || 0,
      discountFlat: 0,
      minOrder: Number(minOrder) || 0,
      maxUses: Number(maxUses) || 100,
      usedCount: 0,
      active: true,
      expiresAt: null
    });
    showAdminToast(`Promo ${code} created successfully`, "success");
    loadAdminPromoCodes();
  } catch (e) {
    showAdminToast("Failed to create promo code", "error");
  }
}

window.deletePromo = async (code) => {
  if (!confirm(`Delete promo code ${code}?`)) return;
  try {
    await deleteDoc(doc(db, "promoCodes", code));
    showAdminToast("Promo deleted", "info");
    loadAdminPromoCodes();
  } catch (e) {
    showAdminToast("Delete failed", "error");
  }
};
