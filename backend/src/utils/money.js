export function roundMoney(amount, currency = "USD") {
  if (currency === "BTC" || currency === "ETH") {
    return Number(Number(amount).toFixed(6));
  }
  return Number(Number(amount).toFixed(2));
}

export function validateCurrencyAmount(amount, currency = "USD") {
  const val = Number(amount);
  return !isNaN(val) && val >= 0;
}
