import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, googleProvider, db } from "./firebase.js";
import { showToast } from "./ui.js";

let currentUser = null;
let userProfile = null;
const listeners = [];

export function subscribeAuth(callback) {
  listeners.push(callback);
  if (currentUser !== undefined) {
    callback(currentUser, userProfile);
  }
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        userProfile = snap.data();
      } else {
        userProfile = {
          email: user.email || "",
          name: user.displayName || user.email?.split("@")[0] || "Customer",
          photoURL: user.photoURL || "",
          role: "customer",
          whatsapp: "",
          fcmTokens: [],
          createdAt: serverTimestamp()
        };
        await setDoc(userRef, userProfile);
      }
    } catch (err) {
      console.warn("Could not fetch remote profile, using local fallback", err);
      userProfile = {
        email: user.email || "",
        name: user.displayName || "Customer",
        role: "customer"
      };
    }
  } else {
    userProfile = null;
  }

  listeners.forEach((cb) => cb(currentUser, userProfile));
});

export function getCurrentUser() {
  return currentUser;
}

export function getUserProfile() {
  return userProfile;
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    showToast(`Welcome back, ${result.user.displayName || "Customer"}!`, "success");
    return result.user;
  } catch (err) {
    showToast(err.message || "Failed to sign in with Google", "error");
    throw err;
  }
}

export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    showToast("Signed in successfully!", "success");
    return result.user;
  } catch (err) {
    showToast(err.message || "Invalid credentials", "error");
    throw err;
  }
}

export async function registerWithEmail(email, password, name = "", whatsapp = "") {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      email,
      name: name || email.split("@")[0],
      photoURL: "",
      role: "customer",
      whatsapp,
      fcmTokens: [],
      createdAt: serverTimestamp()
    });
    showToast("Account created successfully!", "success");
    return result.user;
  } catch (err) {
    showToast(err.message || "Registration failed", "error");
    throw err;
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    showToast("Password reset link sent to your email", "success");
  } catch (err) {
    showToast(err.message || "Failed to send reset email", "error");
    throw err;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    showToast("Logged out successfully", "info");
    window.location.reload();
  } catch (err) {
    showToast(err.message || "Logout failed", "error");
  }
}

/**
 * Checks if the customer is logged in. If not, alerts and redirects to login.
 * Explicitly requested: "Customer order korte hole login korte Hobe"
 */
export function requireAuthForOrder(redirectTarget = "/checkout.html") {
  if (!auth.currentUser) {
    showToast("Please log in to place an order (Customer order korte hole login korte hobe)", "warning");
    const target = encodeURIComponent(redirectTarget);
    setTimeout(() => {
      window.location.href = `/login.html?redirect=${target}`;
    }, 1000);
    return false;
  }
  return true;
}
