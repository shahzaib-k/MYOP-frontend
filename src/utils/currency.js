import { CURRENCY_SYMBOL } from "../constants/config";

/** Money is rounded to 2 decimals the same way the backend does. */
export const roundAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value * 100) / 100;
};

/**
 * Formats an amount for display. Whole numbers drop the decimals so a typical
 * price reads "Rs 450" rather than "Rs 450.00".
 */
export const formatCurrency = (amount, { withSymbol = true } = {}) => {
  const value = roundAmount(amount);
  const hasFraction = Math.abs(value % 1) > 0;

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return withSymbol ? `${CURRENCY_SYMBOL} ${formatted}` : formatted;
};

/** Strips everything except digits and a single decimal point. */
export const sanitizeNumericInput = (value) => {
  const digitsOnly = String(value ?? "").replace(/[^0-9.]/g, "");
  const [whole, ...rest] = digitsOnly.split(".");

  return rest.length > 0 ? `${whole}.${rest.join("")}` : whole;
};
