import { getMessagingSafe } from "./firebase.js";
import { getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";
import { showToast } from "./ui.js";

export async function requestFCMToken() {
  try {
    const messaging = await getMessagingSafe();
    if (!messaging) return null;

    if (!("Notification" in window)) return null;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BEl_example_vapid_key_placeholder"
      });
      return token;
    }
  } catch (err) {
    console.warn("FCM Token request was skipped or not configured:", err);
  }
  return null;
}

export async function listenForegroundMessages() {
  try {
    const messaging = await getMessagingSafe();
    if (messaging) {
      onMessage(messaging, (payload) => {
        showToast(`${payload.notification?.title || "New notification"}: ${payload.notification?.body || ""}`, "info");
      });
    }
  } catch (err) {
    console.warn("Foreground message listener not active:", err);
  }
}
