import { collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function loadAdminBanners() {
  const container = document.getElementById("admin-banners-list");
  if (!container) return;

  try {
    const snap = await getDocs(collection(db, "banners"));
    if (snap.empty) {
      container.innerHTML = `<p style="color: #94A3B8;">No custom promotional banners configured. Default hero banner is currently displayed.</p>`;
      return;
    }
    container.innerHTML = snap.docs.map(d => {
      const b = d.data();
      return `
        <div class="glass-card" style="padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="color: #FFFFFF; font-weight: 700;">${b.title}</h4>
            <p style="font-size: 0.8rem; color: #94A3B8;">${b.subtitle || ''}</p>
          </div>
          <button class="btn btn-secondary btn-sm" style="color: var(--danger);" onclick="window.deleteBanner('${d.id}')">Delete</button>
        </div>
      `;
    }).join("");
  } catch (e) {
    container.innerHTML = `<p style="color: var(--danger);">Failed to load banners.</p>`;
  }
}

window.deleteBanner = async (id) => {
  try {
    await deleteDoc(doc(db, "banners", id));
    showAdminToast("Banner deleted", "info");
    loadAdminBanners();
  } catch (e) {
    showAdminToast("Delete failed", "error");
  }
};
