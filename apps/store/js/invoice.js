import { formatMoney, escapeHtml } from "./utils.js";
import { showToast } from "./ui.js";

export async function initInvoicePage() {
  const params = new URLSearchParams(window.location.search);
  const shareToken = params.get("token") || params.get("shareToken");
  const invoiceContainer = document.getElementById("invoice-render-area");

  if (!shareToken) {
    if (invoiceContainer) {
      invoiceContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 16px;">
          <h2 style="color: var(--danger); margin-bottom: 12px;">Invalid Invoice Link</h2>
          <p style="color: #94A3B8;">A valid secure share token is required to view an invoice.</p>
          <a href="/" class="btn btn-secondary btn-sm" style="margin-top: 16px;">Back to Store</a>
        </div>
      `;
    }
    return;
  }

  try {
    const res = await fetch(`/api/invoice/${shareToken}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Invoice not found");

    renderInvoice(data);
  } catch (err) {
    if (invoiceContainer) {
      invoiceContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 16px;">
          <h2 style="color: var(--danger); margin-bottom: 12px;">Invoice Not Found</h2>
          <p style="color: #94A3B8;">${escapeHtml(err.message)}</p>
          <a href="/" class="btn btn-secondary btn-sm" style="margin-top: 16px;">Back to Store</a>
        </div>
      `;
    }
  }

  setupExportButtons();
}

function renderInvoice(order) {
  const container = document.getElementById("invoice-render-area");
  if (!container) return;

  const currency = order.currency || "USD";

  container.innerHTML = `
    <div class="invoice-container" id="printable-invoice">
      <div class="invoice-header">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--neon-cyan), var(--accent)); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #030817;">AS</div>
            <h2 style="font-size: 1.3rem; font-weight: 800; color: #FFFFFF;">ABDULLAH STORE</h2>
          </div>
          <p style="font-size: 0.8rem; color: #94A3B8;">Your Premium Digital Store</p>
        </div>
        <div style="text-align: right;">
          <h3 style="font-size: 1.1rem; color: var(--neon-cyan); margin-bottom: 4px;">INVOICE</h3>
          <p style="font-size: 0.85rem; color: #E2E8F0;">#${escapeHtml(order.invoiceNo || order.orderNumber)}</p>
          <p style="font-size: 0.75rem; color: #64748B;">Order: ${escapeHtml(order.orderNumber)}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 0.85rem;">
        <div>
          <h5 style="color: #94A3B8; text-transform: uppercase; font-size: 0.72rem; margin-bottom: 6px;">Billed To:</h5>
          <p style="font-weight: 700; color: #FFFFFF;">${escapeHtml(order.customer?.name || "Customer")}</p>
          <p style="color: #94A3B8;">${escapeHtml(order.customer?.email || "")}</p>
          <p style="color: #94A3B8;">WhatsApp: ${escapeHtml(order.customer?.whatsapp || "N/A")}</p>
        </div>
        <div style="text-align: right;">
          <h5 style="color: #94A3B8; text-transform: uppercase; font-size: 0.72rem; margin-bottom: 6px;">Status & Payment:</h5>
          <p>Order Status: <span class="badge ${order.orderStatus === 'COMPLETED' ? 'badge-available' : 'badge-featured'}">${escapeHtml(order.orderStatus || 'PENDING')}</span></p>
          <p style="margin-top: 4px;">Payment: <span class="badge ${order.paymentStatus === 'PAID' ? 'badge-available' : 'badge-soldout'}">${escapeHtml(order.paymentStatus || 'PENDING')}</span></p>
          <p style="margin-top: 4px; color: #94A3B8;">Method: ${escapeHtml(order.paymentMethod || 'Manual')}</p>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(item => `
            <tr>
              <td>
                <div style="font-weight: 600; color: #FFFFFF;">${escapeHtml(item.title)}</div>
                <div style="font-size: 0.75rem; color: #94A3B8;">${escapeHtml(item.deliveryInfo || 'Digital credentials delivery')}</div>
              </td>
              <td style="text-align: center; color: var(--neon-cyan); font-weight: 600;">${item.quantity}</td>
              <td style="text-align: right; font-weight: 700; color: #FFFFFF;">${formatMoney(item.lineTotal || (item.unitPrice * item.quantity), currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="margin-left: auto; width: 100%; max-width: 280px; font-size: 0.9rem; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #94A3B8;">
          <span>Subtotal:</span>
          <span>${formatMoney(order.subtotal || 0, currency)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #94A3B8;">
          <span>Discount:</span>
          <span>-${formatMoney(order.discount || 0, currency)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 1.15rem; font-weight: 800; color: #FFFFFF;">
          <span>Total:</span>
          <span style="color: var(--neon-cyan);">${formatMoney(order.total || 0, currency)}</span>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; text-align: center; font-size: 0.8rem; color: #64748B;">
        <p style="margin-bottom: 6px;">Thank you for shopping at ABDULLAH STORE. For support or warranty claims, contact us with your invoice number.</p>
        <p style="font-weight: 700; color: var(--neon-cyan);">Developed by MD ABDULLAH</p>
      </div>
    </div>
  `;
}

function setupExportButtons() {
  const printBtn = document.getElementById("print-invoice-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
