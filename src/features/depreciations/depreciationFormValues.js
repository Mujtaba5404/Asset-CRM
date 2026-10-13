import { toDateValue } from "../../utils/dateValue";

export const DEPRECIATION_METHODS = {
  STRAIGHT_LINE: "STRAIGHT_LINE",
  DECLINING_BALANCE: "DECLINING_BALANCE",
};

export const DEPRECIATION_METHOD_OPTIONS = [
  { value: DEPRECIATION_METHODS.STRAIGHT_LINE, label: "Straight line", color: "blue" },
  { value: DEPRECIATION_METHODS.DECLINING_BALANCE, label: "Declining balance", color: "grape" },
];

const METHOD_BY_VALUE = new Map(DEPRECIATION_METHOD_OPTIONS.map((option) => [option.value, option]));

/** Unknown methods still render — as their raw value in gray. */
export const getDepreciationMethod = (value) => METHOD_BY_VALUE.get(value) ?? { value, label: value || "—", color: "gray" };

/** The asset reference may arrive populated, as a bare id, or as null. */
const toId = (value) => value?._id ?? value ?? null;

export const DEPRECIATION_INITIAL_VALUES = {
  asset: null,
  method: DEPRECIATION_METHODS.STRAIGHT_LINE,
  acquisitionCost: "",
  salvageValue: "",
  usefulLifeMonths: "",
  depreciationRate: "",
  startDate: null,
};

/** Map a fetched depreciation onto form values. The start date becomes a "YYYY-MM-DD" string. */
export const toDepreciationFormValues = (depreciation = {}) => ({
  asset: toId(depreciation.asset),
  method: depreciation.method ?? DEPRECIATION_METHODS.STRAIGHT_LINE,
  acquisitionCost: depreciation.acquisitionCost ?? "",
  salvageValue: depreciation.salvageValue ?? "",
  usefulLifeMonths: depreciation.usefulLifeMonths ?? "",
  depreciationRate: depreciation.depreciationRate ?? "",
  startDate: toDateValue(depreciation.startDate),
});

const toNumber = (value) => (value === "" || value === null || value === undefined ? null : Number(value));

export const toDepreciationPayload = (values) => ({
  asset: values.asset,
  method: values.method,
  acquisitionCost: toNumber(values.acquisitionCost),
  salvageValue: toNumber(values.salvageValue),
  usefulLifeMonths: toNumber(values.usefulLifeMonths),
  depreciationRate: toNumber(values.depreciationRate),
  startDate: values.startDate,
});

const isBlank = (value) => value === null || value === undefined || value === "";

const required = (message) => (value) => (isBlank(value) ? message : null);

export const depreciationValidation = {
  asset: required("Asset is required"),
  method: required("Method is required"),
  acquisitionCost: (value) => (isBlank(value) || Number(value) <= 0 ? "Acquisition cost must be greater than 0" : null),
  salvageValue: (value, values) => {
    if (isBlank(value) || Number(value) < 0) return "Salvage value is required";

    if (!isBlank(values.acquisitionCost) && Number(value) > Number(values.acquisitionCost)) return "Salvage value cannot exceed the acquisition cost";

    return null;
  },
  usefulLifeMonths: (value) => (isBlank(value) || !Number.isInteger(Number(value)) || Number(value) < 1 ? "Useful life must be at least 1 month" : null),
  depreciationRate: (value, values) => {
    if (isBlank(value)) return values.method === DEPRECIATION_METHODS.DECLINING_BALANCE ? "Rate is required for declining balance" : null;

    return Number(value) < 0 || Number(value) > 100 ? "Rate must be between 0 and 100" : null;
  },
  startDate: required("Start date is required"),
};
