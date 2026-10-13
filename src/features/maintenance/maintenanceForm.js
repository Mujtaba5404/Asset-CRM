/**
 * Shared form contract for the add, edit and "mark completed" maintenance drawers.
 */
import { IconCircleCheck, IconPlayerPlay } from "@tabler/icons-react";
import ENUMS from "../../constants/ENUMS";
import { toDateValue } from "../../utils/dateValue";

const { STATUSES } = ENUMS.MAINTENANCE;

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: STATUSES.INITIATED, label: "Initiated", color: "blue", icon: IconPlayerPlay },
  { value: STATUSES.COMPLETED, label: "Completed", color: "teal", icon: IconCircleCheck },
];

export const getMaintenanceStatusOption = (status) => MAINTENANCE_STATUS_OPTIONS.find((option) => option.value === status);

export const isCompleted = (status) => status === STATUSES.COMPLETED;

/** Anything unrecognised starts as Initiated so the dropdown always has a valid selection. */
const toStatus = (status) => {
  const value = status?.toString().trim().toLowerCase();

  return Object.values(STATUSES).includes(value) ? value : STATUSES.INITIATED;
};

/**
 * Only the photo set the status shows is sent: before for an Initiated job,
 * after for a Completed one. Picks left in the hidden set are dropped.
 */
export const photosForStatus = (status, photos) => (isCompleted(status) ? { conditionAfter: photos.conditionAfter } : { conditionBefore: photos.conditionBefore });

export const EMPTY_CHECKLIST_ITEM = { item: null, condition: null };

export const getMaintenanceInitialValues = () => ({
  asset: null,
  type: null,
  status: STATUSES.INITIATED,
  priority: null,
  vendor: null,
  startDate: toDateValue(new Date()),
  endDate: null,
  cost: "",
  checklist: [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: "",
});

const required = (message) => (value) => (value === null || value === undefined || value === "" ? message : null);

export const maintenanceValidation = {
  asset: required("Asset is required"),
  type: required("Type is required"),
  status: required("Status is required"),
  priority: required("Priority is required"),
  startDate: required("Start date is required"),
  endDate: (value, values) => {
    if (!value) return isCompleted(values.status) ? "A completed job needs an end date" : null;

    // Both are "YYYY-MM-DD" strings, so they compare correctly as text.
    return values.startDate && value < values.startDate ? "End date cannot be before the start date" : null;
  },
  cost: (value) => (value !== "" && value !== null && Number(value) < 0 ? "Cost cannot be negative" : null),
};

/** References arrive populated on read and are sent back as ids. */
const toId = (value) => value?._id ?? value ?? null;

export const maintenanceToFormValues = (job = {}) => ({
  asset: toId(job.asset),
  type: toId(job.type),
  status: toStatus(job.status),
  priority: toId(job.priority),
  vendor: toId(job.vendor),
  startDate: toDateValue(job.startDate),
  endDate: toDateValue(job.endDate),
  cost: job.cost ?? "",
  checklist: job.checklist?.length ? job.checklist.map((row) => ({ item: toId(row.item), condition: toId(row.condition) })) : [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: job.notes || "",
});

/**
 * Form values plus newly picked photos → the multipart body the API expects.
 *
 * Checklist rows go over in bracket notation, `checklist[0][item]` /
 * `checklist[0][condition]`, which the multipart parser rebuilds into an array
 * of objects. The dot form `checklist[0].item` is not parsed and the server
 * saves `checklist: []` for it.
 *
 * Each photo is appended under its own field so the server can tell the
 * before shots from the after shots.
 */
export const maintenanceToFormData = ({ checklist, ...values }, { conditionBefore = [], conditionAfter = [] } = {}) => {
  const formData = new FormData();

  // Empty optionals are left out: an empty string is not a valid id or date.
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    formData.append(key, value);
  });

  checklist
    .filter((row) => row.item)
    .forEach((row, index) => {
      formData.append(`checklist[${index}][item]`, row.item);
      if (row.condition) formData.append(`checklist[${index}][condition]`, row.condition);
    });

  conditionBefore.forEach((file) => formData.append("conditionBefore", file));
  conditionAfter.forEach((file) => formData.append("conditionAfter", file));

  return formData;
};
