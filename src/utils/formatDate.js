import dayjs from "dayjs";

const EM_DASH = "—";

/**
 * Formats a date for display.
 *
 * Returns a dash for missing or unparseable values — `dayjs(undefined)` is
 * *today*, so an unset date would otherwise silently render as the current date.
 */
const formatDate = (date, format = "MMM DD, YYYY", fallback = EM_DASH) => {
  if (!date) return fallback;

  const parsed = dayjs(date);

  if (!parsed.isValid()) return fallback;

  return parsed.startOf("day").format(format);
};

export default formatDate;
