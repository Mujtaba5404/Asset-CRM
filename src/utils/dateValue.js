import dayjs from "dayjs";

/**
 * Mantine 9 date inputs are string-based: `value` accepts a Date but `onChange`
 * always emits a `"YYYY-MM-DD"` string. Mixing the two means a form holds a Date
 * until the user touches the field and a string afterwards, so the payload shape
 * depends on what was edited. These helpers keep everything on strings.
 */
export const DATE_VALUE_FORMAT = "YYYY-MM-DD";

/** Normalise anything date-ish (Date, ISO string, dayjs) to `"YYYY-MM-DD"` or null. */
export const toDateValue = (value) => {
  if (!value) return null;

  const parsed = dayjs(value);

  return parsed.isValid() ? parsed.format(DATE_VALUE_FORMAT) : null;
};

/** Whole days from today until `value`. Negative when in the past, null when unset. */
export const daysUntil = (value) => {
  const normalized = toDateValue(value);

  if (!normalized) return null;

  return dayjs(normalized).startOf("day").diff(dayjs().startOf("day"), "day");
};

export const isPast = (value) => {
  const days = daysUntil(value);

  return days !== null && days < 0;
};

/** True when `value` falls inside the next `withinDays` days (and is not already past). */
export const isDueSoon = (value, withinDays = 30) => {
  const days = daysUntil(value);

  return days !== null && days >= 0 && days <= withinDays;
};

export const DAYS_IN_YEAR = 365;

/**
 * A span written in whatever unit stays readable: anything from a year up reads
 * in years, everything shorter in days. Sign is ignored — callers decide whether
 * the span is "left" or "ago".
 */
const describeSpan = (days, { short = false } = {}) => {
  const magnitude = Math.abs(days);

  if (magnitude < DAYS_IN_YEAR) return short ? `${magnitude}d` : `${magnitude} ${magnitude === 1 ? "day" : "days"}`;

  const years = Number((magnitude / DAYS_IN_YEAR).toFixed(1));

  return short ? `${years}y` : `${years} ${years === 1 ? "year" : "years"}`;
};

/** Compact span for stat tiles and badges — "412d" becomes "1.1y". */
export const formatDayCount = (days) => describeSpan(days, { short: true });

/** "in 12 days" / "in 1.4 years" / "3 days ago" / "today" — null when there is no date. */
export const describeDueDate = (value) => {
  const days = daysUntil(value);

  if (days === null) return null;

  if (days === 0) return "today";

  const span = describeSpan(days);

  return days > 0 ? `in ${span}` : `${span} ago`;
};
