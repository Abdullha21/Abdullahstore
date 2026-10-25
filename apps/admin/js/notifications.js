import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

export async function sendAdminNotification(target, title, body, link = "") {
  try {
    await addDoc(collection(db, "notifications"), {
      userId: target === "ALL" ? null : target,
      target: target,
      title: title,
      body: body,
      link: link,
      read: false,
      createdAt: serverTimestamp()
    });

    // Also trigger backend push notification route
    try {
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, title, body, link })
      });
    } catch (e) {}

    showAdminToast("Notification broadcasted successfully!", "success");
    return true;
  } catch (err) {
    showAdminToast("Notification broadcast failed", "error");
    return false;
  }
}
