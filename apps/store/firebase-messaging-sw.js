importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBpEnmamrWAeAbnsUDDgUzVcaqB0q2Sl_M",
  projectId: "ecommerceproject-ca840",
  messagingSenderId: "1010677219657",
  appId: "1:1010677219657:web:b757e0dc8d6cca2ebd9a98"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "ABDULLAH STORE Update";
  const notificationOptions = {
    body: payload.notification?.body || "Your order status has been updated.",
    icon: "/assets/icons/icon-192.png",
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
