export function showAdminToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const borderCol = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#22D3EE';
  toast.style.cssText = `background: #0B1D3A; border-left: 4px solid ${borderCol}; border-radius: 8px; padding: 12px 18px; color: #FFFFFF; font-size: 0.88rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 260px;`;
  toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="color: #64748B;">&times;</button>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

export function renderAdminLayout(activePage = 'dashboard') {
  const sidebar = document.querySelector('.admin-sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <div class="sidebar-logo">AS</div>
      <span style="font-weight: 800; font-size: 1.05rem; color: #FFFFFF;">ABDULLAH ADMIN</span>
    </div>

    <nav class="sidebar-nav">
      <a href="/admin/dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
        <span>Dashboard</span>
      </a>
      <a href="/admin/orders.html" class="nav-item ${activePage === 'orders' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span>Orders</span>
      </a>
      <a href="/admin/manual-order.html" class="nav-item ${activePage === 'manual-order' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Manual Order / Invoice</span>
      </a>
      <a href="/admin/products.html" class="nav-item ${activePage === 'products' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        <span>Products CRUD</span>
      </a>
      <a href="/admin/promo-codes.html" class="nav-item ${activePage === 'promo-codes' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
        <span>Promo Codes</span>
      </a>
      <a href="/admin/payment-methods.html" class="nav-item ${activePage === 'payment-methods' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        <span>Payment Methods</span>
      </a>
      <a href="/admin/banners.html" class="nav-item ${activePage === 'banners' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span>Hero Banners</span>
      </a>
      <a href="/admin/notifications.html" class="nav-item ${activePage === 'notifications' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <span>Send Notifications</span>
      </a>
      <a href="/admin/users.html" class="nav-item ${activePage === 'users' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span>Manage Users</span>
      </a>
      <a href="/admin/settings.html" class="nav-item ${activePage === 'settings' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span>Site Settings</span>
      </a>

      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
        <a href="/" target="_blank" class="nav-item" style="color: var(--neon-cyan);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <span>View Public Store</span>
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div>Developed by <strong>MD ABDULLAH</strong></div>
    </div>
  `;
}
