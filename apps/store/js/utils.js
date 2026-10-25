// Utility Functions for ABDULLAH STORE

export const CURRENCY_SYMBOLS = {
  USD: '$',
  NGN: '₦',
  BTC: '₿',
  USDT: '₮',
  ETH: 'Ξ'
};

export function formatMoney(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return 'N/A';
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (currency === 'BTC' || currency === 'ETH') {
    return `${sym} ${parseFloat(amount).toFixed(5)}`;
  }
  return `${sym} ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
  }
  return false;
}
