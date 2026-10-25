import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { showAdminToast } from "./ui.js";

const DEFAULT_SETTINGS = {
  siteName: "ABDULLAH STORE",
  logo: "",
  whatsapp: "+1234567890",
  telegram: "https://t.me/abdullahstore",
  currencies: ["USD", "NGN", "BTC", "USDT", "ETH"],
  defaultCurrency: "USD",
  footerCredit: "Developed by MD ABDULLAH", // Locked
  maintenanceMode: false,
  bannerAutoSlide: 5000
};

export async function loadAdminSettings() {
  let settings = DEFAULT_SETTINGS;
  try {
    const snap = await getDoc(doc(db, "settings", "general"));
    if (snap.exists()) {
      settings = { ...DEFAULT_SETTINGS, ...snap.data() };
    }
  } catch (e) {
    console.warn("Using default settings:", e);
  }

  const siteNameInput = document.getElementById("setting-sitename");
  const whatsappInput = document.getElementById("setting-whatsapp");
  const telegramInput = document.getElementById("setting-telegram");
  const defaultCurrencyInput = document.getElementById("setting-defaultcurrency");
  const autoSlideInput = document.getElementById("setting-autoslide");
  const lockedCreditInput = document.getElementById("setting-locked-credit");

  if (siteNameInput) siteNameInput.value = settings.siteName;
  if (whatsappInput) whatsappInput.value = settings.whatsapp;
  if (telegramInput) telegramInput.value = settings.telegram;
  if (defaultCurrencyInput) defaultCurrencyInput.value = settings.defaultCurrency;
  if (autoSlideInput) autoSlideInput.value = settings.bannerAutoSlide;
  if (lockedCreditInput) {
    lockedCreditInput.value = "Developed by MD ABDULLAH";
    lockedCreditInput.disabled = true; // Permanently locked as required
  }
}

export async function saveAdminSettings(data) {
  try {
    // Enforce locked credit
    data.footerCredit = "Developed by MD ABDULLAH";
    await setDoc(doc(db, "settings", "general"), data, { merge: true });
    showAdminToast("Store settings saved successfully!", "success");
  } catch (e) {
    showAdminToast("Failed to save settings", "error");
  }
}
