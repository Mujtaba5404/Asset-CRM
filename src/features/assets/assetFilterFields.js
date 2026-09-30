import useFilters from "../../hooks/useFilters";

/**
 * Every filter the assets list understands, in one place. The filter drawer, the
 * active chips and "clear all" all read from this list, so adding a filter is a
 * single row.
 */
export const ASSET_FILTER_FIELDS = [
  { key: "serialNumber", label: "Serial number", type: "text", placeholder: "MAC-BOOK-PRO" },
  { key: "tag", label: "Tag", type: "text", placeholder: "AST-0042" },
  { key: "createdAt", label: "Created", type: "dateRange" },
  { key: "category", label: "Category", type: "picklist" },
  { key: "subCategory", label: "Sub category", type: "picklist" },
  { key: "location", label: "Location", type: "picklist" },
  { key: "status", label: "Status", type: "picklist" },
  { key: "condition", label: "Condition", type: "picklist" },
];

const isActive = (value) => (Array.isArray(value) ? value.filter(Boolean).length > 0 : value !== undefined && value !== null && value !== "");

/** Short human description of a filter's current value, for the chip label. */
export const describeFilter = (field, value) => {
  if (field.type === "dateRange") return "date range";

  if (Array.isArray(value)) return `${value.filter(Boolean).length} selected`;

  return String(value);
};

/** The empty value that clears a field without leaving a stray URL param. */
export const emptyValueFor = (field, currentValue) => (field.type === "dateRange" || Array.isArray(currentValue) ? [] : "");

export const useAssetFilterState = () => {
  const { filters, setFilters, resetFilters } = useFilters();

  const activeFields = ASSET_FILTER_FIELDS.filter((field) => isActive(filters[field.key]));

  return { filters, setFilters, resetFilters, activeFields, activeCount: activeFields.length };
};
