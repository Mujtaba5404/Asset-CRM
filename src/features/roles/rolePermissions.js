import {
  IconApps,
  IconBox,
  IconBuilding,
  IconBuildingStore,
  IconKey,
  IconListDetails,
  IconPackage,
  IconPaperclip,
  IconShieldLock,
  IconTool,
  IconTrendingDown,
  IconUser,
} from "@tabler/icons-react";
import SCOPE from "../../constants/SCOPE";

export const PERMISSION_ACTIONS = ["create", "read", "update", "delete"];


const RESOURCE_ICONS = {
  Access: IconKey,
  Application: IconApps,
  Asset: IconPackage,
  Attachment: IconPaperclip,
  Brand: IconBuildingStore,
  Company: IconBuilding,
  Depreciation: IconTrendingDown,
  Maintenance: IconTool,
  Picklist: IconListDetails,
  Role: IconShieldLock,
  User: IconUser,
};

export const getResourceIcon = (resource) => RESOURCE_ICONS[resource] ?? IconBox;

export const SCOPE_OPTIONS = [
  { value: SCOPE.OWN, label: "Own", description: "Only records they created", color: "gray" },
  { value: SCOPE.BRAND, label: "Brand", description: "Records in their assigned brands", color: "blue" },
  { value: SCOPE.COMPANY, label: "Company", description: "Records in their assigned companies", color: "teal" },
  { value: SCOPE.ALL, label: "All", description: "Every record in the workspace", color: "orange" },
];

export const SCOPE_BY_VALUE = new Map(SCOPE_OPTIONS.map((option) => [option.value, option]));


export const LANDING_PAGE_OPTIONS = ["/", "/summary", "/assets", "/depreciations", "/maintenance","/settings/picklists", "/roles"];

export const sortActions = (actions = []) => PERMISSION_ACTIONS.filter((action) => actions.includes(action));


/**
 * Resources the app guards, with their editable fields. Seeded into every
 * catalog so a resource can be granted before any role has it — otherwise a
 * new module (Maintenance) could never be switched on from the role editor.
 */
const APP_RESOURCES = {
  Maintenance: ["asset", "type", "status", "priority", "vendor", "startDate", "endDate", "cost", "checklist", "notes", "conditionBefore", "conditionAfter"],
  Access: ["user", "roles"],
};

export const buildResourceCatalog = (roles = []) => {
  const catalog = new Map(Object.entries(APP_RESOURCES).map(([resource, fields]) => [resource, new Set(fields)]));

  roles
    .flatMap((role) => role?.permissions ?? [])
    .forEach(({ resource, allowedUpdateFields = [] }) => {
      if (!resource) return;

      const fields = catalog.get(resource) ?? new Set();
      allowedUpdateFields.forEach((field) => fields.add(field));
      catalog.set(resource, fields);
    });

  return [...catalog]
    .map(([resource, fields]) => ({ resource, fields: [...fields] }))
    .sort((a, b) => a.resource.localeCompare(b.resource));
};

export const toFormPermissions = (permissions = [], catalog = []) => {
  const byResource = new Map(permissions.map((permission) => [permission.resource, permission]));

  return Object.fromEntries(
    catalog.map(({ resource, fields }) => {
      const permission = byResource.get(resource);

      return [resource, { actions: sortActions(permission?.actions), allowedUpdateFields: permission?.allowedUpdateFields ?? fields }];
    }),
  );
};


export const toPayloadPermissions = (formPermissions = {}) =>
  Object.entries(formPermissions)
    .filter(([, { actions }]) => actions.length)
    .map(([resource, { actions, allowedUpdateFields }]) => ({ resource, actions: sortActions(actions), allowedUpdateFields }));

export const describeAccess = (actions = []) => {
  if (!actions.length) return "No access";
  if (actions.length === PERMISSION_ACTIONS.length) return "Full access";
  if (actions.length === 1 && actions[0] === "read") return "Read only";

  return `${actions.length} of ${PERMISSION_ACTIONS.length} actions`;
};

export const getRoleFormInitialValues = (role, catalog) => ({
  title: role?.title ?? "",
  scope: role?.scope ?? SCOPE.COMPANY,
  indexPath: role?.indexPath ?? "/",
  permissions: toFormPermissions(role?.permissions, catalog),
});

export const roleFormValidate = {
  title: (value) => (value.trim() ? null : "Title is required"),
  indexPath: (value) => (value.trim().startsWith("/") ? null : "Path must start with /"),
  permissions: (value) => (toPayloadPermissions(value).length ? null : "Grant at least one permission"),
};

export const toRolePayload = (values) => ({
  title: values.title.trim(),
  scope: values.scope,
  indexPath: values.indexPath.trim(),
  permissions: toPayloadPermissions(values.permissions),
});
