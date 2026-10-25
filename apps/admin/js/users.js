import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function loadAdminUsers() {
  const tbody = document.getElementById("admin-users-tbody");
  if (!tbody) return;

  try {
    const snap = await getDocs(collection(db, "users"));
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No registered users yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = snap.docs.map(d => {
      const u = d.data();
      const uid = d.id;
      return `
        <tr>
          <td><strong style="color: #FFFFFF;">${u.name || "Customer"}</strong></td>
          <td>${u.email || ""}</td>
          <td>${u.whatsapp || "N/A"}</td>
          <td>
            <select class="form-select" style="padding: 4px 8px; font-size: 0.8rem;" onchange="window.updateUserRole('${uid}', this.value)">
              <option value="customer" ${u.role !== 'admin' ? 'selected' : ''}>Customer</option>
              <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </td>
          <td><code style="font-size: 0.75rem; color: #64748B;">${uid.slice(0, 10)}...</code></td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger); padding: 20px;">Failed to load users.</td></tr>`;
  }
}

window.updateUserRole = async (uid, role) => {
  try {
    await updateDoc(doc(db, "users", uid), { role });
    showAdminToast(`User role updated to ${role}`, "success");
  } catch (e) {
    showAdminToast("Role update failed", "error");
  }
};
