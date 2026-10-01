import { ASSET_FILTER_FIELDS } from "./assetFilterFields";

/**
 * The fields the summary endpoint can group by.
 *
 * Derived from the filter fields rather than listed again: every picklist the
 * list can filter on is a picklist the register can be grouped by, so adding a
 * filter adds a grouping without touching this file.
 */
export const ASSET_GROUP_FIELDS = ASSET_FILTER_FIELDS.filter((field) => field.type === "picklist");

export const ASSET_GROUP_OPTIONS = ASSET_GROUP_FIELDS.map(({ key, label }) => ({ value: key, label }));

export const isGroupField = (key) => ASSET_GROUP_FIELDS.some((field) => field.key === key);

export const groupLabel = (key) => ASSET_GROUP_FIELDS.find((field) => field.key === key)?.label ?? key;

/** The landing view — "where is it" against "what state is it in" — falling back to
 * whatever the list offers if either field is ever dropped. */
const preferred = (key, position) => (isGroupField(key) ? key : ASSET_GROUP_FIELDS[position]?.key);

export const DEFAULT_PRIMARY_GROUP = preferred("location", 0);
export const DEFAULT_SECONDARY_GROUP = preferred("status", 1);

/** Fall back to the default whenever the URL carries a field the endpoint cannot group by. */
export const resolveGroup = (value, fallback) => (isGroupField(value) ? value : fallback);
