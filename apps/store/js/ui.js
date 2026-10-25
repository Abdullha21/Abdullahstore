// UI Component Helpers & Toasts

export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  }[type] || '';

  toast.innerHTML = `
    ${iconSvg}
    <div style="flex: 1; word-break: break-word;">${message}</div>
    <button style="color: #94A3B8; font-size: 1.2rem; line-height: 1;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function showInstallPopup(onInstall, onDismiss) {
  if (document.getElementById('pwa-install-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'pwa-install-popup';
  popup.className = 'install-popup-card';
  popup.innerHTML = `
    <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 12px;">
      <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #00B7FF, #6366F1); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; color: #030817; box-shadow: 0 0 16px rgba(0, 183, 255, 0.5);">
        AS
      </div>
      <div style="flex: 1;">
        <h4 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">Install ABDULLAH STORE App</h4>
        <p style="font-size: 0.78rem; color: #94A3B8;">Download our high-speed mobile web app for instant account updates and fast checkout.</p>
      </div>
      <button id="pwa-popup-close" style="color: #64748B; font-size: 1.3rem; padding: 4px;">&times;</button>
    </div>
    <div style="display: flex; gap: 10px;">
      <button id="pwa-install-btn" class="btn btn-neon btn-sm" style="flex: 1;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download Web App
      </button>
      <button id="pwa-dismiss-btn" class="btn btn-secondary btn-sm">
        Later
      </button>
    </div>
  `;

  document.body.appendChild(popup);

  const dismiss = () => {
    popup.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => popup.remove(), 300);
    if (onDismiss) onDismiss();
  };

  popup.querySelector('#pwa-popup-close').addEventListener('click', dismiss);
  popup.querySelector('#pwa-dismiss-btn').addEventListener('click', dismiss);
  popup.querySelector('#pwa-install-btn').addEventListener('click', () => {
    if (onInstall) onInstall();
    dismiss();
  });
}
