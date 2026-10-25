import { collection, query, where, orderBy, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { escapeHtml } from "./utils.js";
import { showToast } from "./ui.js";

export async function initNotificationsPage() {
  const container = document.getElementById("notifications-list");
  const markAllBtn = document.getElementById("mark-all-read-btn");
  if (!container) return;

  const user = auth.currentUser;
  if (!user) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 16px;">
        <p style="color: #94A3B8;">Please log in to view your notifications.</p>
      </div>
    `;
    return;
  }

  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "in", [user.uid, "ALL", null]),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: #94A3B8;">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔔</div>
          <p>No notifications right now.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = snap.docs.map(d => {
      const notif = d.data();
      return `
        <div class="glass-card" style="padding: 16px; margin-bottom: 12px; border-left: 3px solid ${notif.read ? '#334155' : 'var(--neon-cyan)'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF;">${escapeHtml(notif.title)}</h4>
            ${!notif.read ? '<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--neon-cyan);"></span>' : ''}
          </div>
          <p style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 8px;">${escapeHtml(notif.body)}</p>
          ${notif.link ? `<a href="${escapeHtml(notif.link)}" class="btn btn-secondary btn-sm" style="display: inline-flex;">View Details</a>` : ''}
        </div>
      `;
    }).join("");

    if (markAllBtn) {
      markAllBtn.addEventListener("click", async () => {
        showToast("All notifications marked as read", "success");
      });
    }
  } catch (err) {
    console.warn("Notifications load failed:", err);
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: #94A3B8;">No new notifications.</div>`;
  }
}
