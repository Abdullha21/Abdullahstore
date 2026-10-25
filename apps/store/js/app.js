import { initCart, subscribeCart, getCartCount, setCurrency, getCurrency } from "./cart.js";
import { subscribeAuth, logout } from "./auth.js";
import { showInstallPopup, showToast } from "./ui.js";
import { listenForegroundMessages } from "./fcm.js";

let deferredInstallPrompt = null;

document.addEventListener("DOMContentLoaded", () => {
  initCart();
  setupHeaderAndNavigation();
  setupCurrencySelectors();
  setupPWA();
  listenForegroundMessages();
});

function setupHeaderAndNavigation() {
  const cartBadge = document.getElementById("header-cart-badge");
  const bottomCartBadge = document.getElementById("bottom-cart-badge");

  // Subscribe to cart updates
  subscribeCart(() => {
    const count = getCartCount();
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? "flex" : "none";
    }
    if (bottomCartBadge) {
      bottomCartBadge.textContent = count;
      bottomCartBadge.style.display = count > 0 ? "flex" : "none";
    }
  });

  // Mobile drawer controls
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const drawerClose = document.getElementById("drawer-close");

  if (menuToggle && drawerBackdrop) {
    menuToggle.addEventListener("click", () => {
      drawerBackdrop.classList.add("open");
    });
  }
  if (drawerClose && drawerBackdrop) {
    drawerClose.addEventListener("click", () => {
      drawerBackdrop.classList.remove("open");
    });
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", (e) => {
      if (e.target === drawerBackdrop) {
        drawerBackdrop.classList.remove("open");
      }
    });
  }

  // Active bottom nav highlight
  const currentPath = window.location.pathname;
  document.querySelectorAll(".bottom-nav-item").forEach(item => {
    const href = item.getAttribute("href");
    if (href === currentPath || (href === "/" && (currentPath === "/index.html" || currentPath === ""))) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Auth state update
  subscribeAuth((user, profile) => {
    const accountLink = document.getElementById("header-account-link");
    const drawerAuthArea = document.getElementById("drawer-auth-area");
    
    if (user) {
      if (accountLink) {
        accountLink.setAttribute("href", "/account.html");
        accountLink.setAttribute("title", `Logged in as ${user.displayName || user.email}`);
      }
      if (drawerAuthArea) {
        drawerAuthArea.innerHTML = `
          <div style="padding: 12px 14px; background: rgba(99, 102, 241, 0.1); border-radius: var(--radius-md); margin-bottom: 8px;">
            <div style="font-weight: 700; color: #FFFFFF;">${user.displayName || "Customer"}</div>
            <div style="font-size: 0.75rem; color: #94A3B8;">${user.email}</div>
          </div>
          <a href="/account.html" class="drawer-link">Profile & Settings</a>
          <a href="/my-orders.html" class="drawer-link">My Orders</a>
          <button id="drawer-logout-btn" class="drawer-link" style="color: var(--danger); width: 100%; text-align: left;">Log Out</button>
        `;
        document.getElementById("drawer-logout-btn")?.addEventListener("click", logout);
      }
    } else {
      if (accountLink) {
        accountLink.setAttribute("href", "/login.html");
      }
      if (drawerAuthArea) {
        drawerAuthArea.innerHTML = `
          <a href="/login.html" class="btn btn-primary btn-sm btn-block" style="margin-bottom: 8px;">Log In</a>
          <a href="/register.html" class="btn btn-secondary btn-sm btn-block">Create Account</a>
        `;
      }
    }
  });
}

function setupCurrencySelectors() {
  const currencySelects = document.querySelectorAll(".currency-selector");
  const current = getCurrency();
  currencySelects.forEach(select => {
    select.value = current;
    select.addEventListener("change", (e) => {
      setCurrency(e.target.value);
    });
  });
}

function setupPWA() {
  // Capture install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  // "Website doklei webapp dawonlod korar akta papap asbe"
  // Show popup automatically on entry unless dismissed in this session
  const hasSeenPopup = sessionStorage.getItem("pwa_install_prompt_seen");
  if (!hasSeenPopup) {
    setTimeout(() => {
      showInstallPopup(
        async () => {
          if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === "accepted") {
              showToast("Thank you for installing ABDULLAH STORE App!", "success");
            }
            deferredInstallPrompt = null;
          } else {
            showToast("To download: Tap your browser menu (⋮ or Share) and select 'Add to Home screen' / 'Install App'", "info", 5000);
          }
          sessionStorage.setItem("pwa_install_prompt_seen", "true");
        },
        () => {
          sessionStorage.setItem("pwa_install_prompt_seen", "true");
        }
      );
    }, 1200);
  }

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch(err => {
        console.warn("ServiceWorker registration:", err);
      });
    });
  }
}
