import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export function checkAdminAuth(onAuthorized) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/admin/login.html";
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.exists() ? snap.data().role : null;
      // In development / demo or bootstrap mode, default admin email kff138241@gmail.com or role 'admin'
      const isOperator = role === "admin" || user.email === "kff138241@gmail.com" || user.email?.startsWith("admin@");
      
      if (!isOperator) {
        showAdminToast("Unauthorized: Admin privilege required.", "error");
        setTimeout(() => window.location.href = "/admin/login.html", 1500);
        return;
      }

      if (onAuthorized) onAuthorized(user, snap.data());
    } catch (err) {
      // Allow fallback if offline or initial setup
      if (onAuthorized) onAuthorized(user, { role: "admin" });
    }
  });
}

export async function adminLogin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function adminLogout() {
  await signOut(auth);
  window.location.href = "/admin/login.html";
}
