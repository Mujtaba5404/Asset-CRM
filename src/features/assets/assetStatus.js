import { upperFirst } from "@mantine/hooks";
import ENUMS from "../../constants/ENUMS";

const { IN_USE, BACKUP, MAINTENANCE, EXPIRED, DISPOSED } = ENUMS.ASSET.STATUSES;

/** Asset status is a fixed server enum, not a picklist — its label and colour live here. */
export const ASSET_STATUS_META = {
  [IN_USE]: { title: "in use", color: "teal" },
  [BACKUP]: { title: "backup", color: "blue" },
  [MAINTENANCE]: { title: "maintenance", color: "orange" },
  [EXPIRED]: { title: "expired", color: "red" },
  [DISPOSED]: { title: "disposed", color: "gray" },
};

export const ASSET_STATUS_OPTIONS = Object.entries(ASSET_STATUS_META).map(([value, { title }]) => ({ value, label: upperFirst(title) }));

export const isAssetStatus = (value) => Object.hasOwn(ASSET_STATUS_META, value ?? "");

/** Shape a status like a populated picklist, so PicklistBadge and the breakdowns render it unchanged. */
export const toStatusItem = (status) => (isAssetStatus(status) ? { _id: status, ...ASSET_STATUS_META[status] } : null);
