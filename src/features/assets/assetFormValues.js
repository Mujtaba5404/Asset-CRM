import { toDateValue } from "../../utils/dateValue";
import { isAssetStatus } from "./assetStatus";

/** Picklist references arrive populated on read and are sent back as ids. */
const toId = (value) => value?._id ?? value ?? null;

export const ASSET_INITIAL_VALUES = {
  serialNumber: "",
  notes: "",
  company: null,
  employee: null,
  // Form-only: mirrors the picked sub category's `meta.requiresEmployee`.
  requiresEmployee: false,
  location: null,
  category: null,
  subCategory: null,
  status: null,
  condition: null,
  purchaseAmount: "",
  purchaseDate: null,
  hasExpiry: false,
  expiryDate: undefined,
  warranty: {
    hasWarranty: false,
    startDate: undefined,
    endDate: undefined,
    provider: undefined,
  },
};

/** Map a fetched asset onto form values. All dates become "YYYY-MM-DD" strings. */
export const toAssetFormValues = (asset = {}) => ({
  serialNumber: asset.serialNumber || "",
  notes: asset.notes || "",
  company: toId(asset.company),
  employee: toId(asset.employee),
  requiresEmployee: !!asset.subCategory?.meta?.requiresEmployee,
  location: toId(asset.location),
  category: toId(asset.category),
  subCategory: toId(asset.subCategory),
  // Records saved while status was a picklist carry an id; make the user re-pick.
  status: isAssetStatus(asset.status) ? asset.status : null,
  condition: toId(asset.condition),
  purchaseAmount: asset.purchaseAmount ?? "",
  purchaseDate: toDateValue(asset.purchaseDate),
  hasExpiry: !!(asset.expiry?.hasExpiry ?? asset.hasExpiry),
  expiryDate: toDateValue(asset.expiry?.expiryDate ?? asset.expiryDate),
  warranty: {
    hasWarranty: !!asset.warranty?.hasWarranty,
    startDate: toDateValue(asset.warranty?.startDate),
    endDate: toDateValue(asset.warranty?.endDate),
    provider: toId(asset.warranty?.provider),
  },
});

/**
 * Strip the branches the user switched off, so turning off "has expiry" or
 * "under warranty" actually clears the stored dates instead of leaving orphans.
 */
export const toAssetPayload = ({ requiresEmployee, hasExpiry, expiryDate, ...values }) => ({
  ...values,
  employee: values.employee || null,
  purchaseAmount:
    values.purchaseAmount === "" ? null : Number(values.purchaseAmount),
  expiry: { hasExpiry, expiryDate: hasExpiry ? expiryDate : undefined },
  warranty: values.warranty.hasWarranty
    ? values.warranty
    : {
        hasWarranty: false,
        startDate: undefined,
        endDate: undefined,
        provider: undefined,
      },
});

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

export const assetValidation = {
  serialNumber: (value) =>
    String(value ?? "").trim().length < 2 ? "Serial number is required" : null,
  company: required("Company is required"),
  employee: (value, values) =>
    values.requiresEmployee && !value
      ? "Employee is required for this sub category"
      : null,
  location: required("Location is required"),
  category: required("Category is required"),
  subCategory: required("Sub category is required"),
  status: required("Status is required"),
  condition: required("Condition is required"),
  purchaseAmount: (value) =>
    value === "" || value === null || Number(value) < 0
      ? "Purchase amount is required"
      : null,
  purchaseDate: required("Purchase date is required"),
  expiryDate: (value, values) =>
    values.hasExpiry && !value
      ? "Expiry date is required when the asset expires"
      : null,
  warranty: {
    startDate: (value, values) =>
      values.warranty.hasWarranty && !value ? "Start date is required" : null,
    endDate: (value, values) => {
      if (!values.warranty.hasWarranty) return null;

      if (!value) return "End date is required";

      if (values.warranty.startDate && value < values.warranty.startDate)
        return "End date cannot be before the start date";

      return null;
    },
  },
};
