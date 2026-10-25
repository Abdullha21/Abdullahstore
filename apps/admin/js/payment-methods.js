import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function loadAdminPaymentMethods() {
  const container = document.getElementById("payment-methods-list");
  if (!container) return;

  try {
    const snap = await getDocs(collection(db, "paymentMethods"));
    if (snap.empty) {
      container.innerHTML = `
        <div class="glass-card" style="padding: 20px; margin-bottom: 14px;">
          <h4 style="color: #FFFFFF; font-weight: 700;">USDT (TRC-20)</h4>
          <p style="font-size: 0.85rem; color: #94A3B8;">Wallet: TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE</p>
          <span class="badge badge-available" style="margin-top: 8px;">Active</span>
        </div>
        <div class="glass-card" style="padding: 20px;">
          <h4 style="color: #FFFFFF; font-weight: 700;">Bank Wire / Transfer</h4>
          <p style="font-size: 0.85rem; color: #94A3B8;">Bank: ABDULLAH GLOBAL COMMERCE (0192837465)</p>
          <span class="badge badge-available" style="margin-top: 8px;">Active</span>
        </div>
      `;
      return;
    }

    container.innerHTML = snap.docs.map(d => {
      const pm = d.data();
      return `
        <div class="glass-card" style="padding: 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between;">
            <h4 style="color: #FFFFFF; font-weight: 700;">${pm.name}</h4>
            <span class="badge ${pm.active ? 'badge-available' : 'badge-soldout'}">${pm.active ? 'Active' : 'Disabled'}</span>
          </div>
          <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 6px;">${pm.config?.walletAddress || pm.config?.accountNumber || ''}</p>
        </div>
      `;
    }).join("");
  } catch (e) {
    console.warn("Payment methods fetch:", e);
  }
}
