import CURRENCY from "../constants/CURRENCY";

/**
 * Display currency for money across the app.
 *
 * Change these two values to re-denominate every amount: the code decides the
 * symbol (see CURRENCY constants for what the backend understands) and the
 * locale decides how it is written — "en-PK" renders PKR as "Rs 1,234,567",
 * where "en-US" would spell it out as "PKR 1,234,567".
 */
export const DISPLAY_CURRENCY = CURRENCY.PKR;
export const DISPLAY_LOCALE = "en-PK";

const formatAmount = (amount = 0, options = {}) => {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;

  const defaultOptions = {
    style: "currency",
    currency: DISPLAY_CURRENCY,
    maximumFractionDigits: options.notation === "compact" ? 1 : Number.isInteger(safeAmount) ? 0 : 2,
  };

  const formatter = new Intl.NumberFormat(DISPLAY_LOCALE, { ...defaultOptions, ...options });

  return formatter.format(safeAmount);
};

/** Short form for stat tiles and axis labels — Rs 4.2M rather than Rs 4,214,908. */
export const formatAmountCompact = (amount = 0) => formatAmount(amount, { notation: "compact" });

export default formatAmount;
