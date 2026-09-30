import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";

/**
 * How to behave when the signed-in user carries NO `effectivePermissions` array.
 *
 * The login endpoint is still stubbed (see features/auth/Login.jsx), so the
 * stored auth object has no permission list yet. With `true` the UI stays fully
 * visible in that state instead of hiding every guarded control, which is what
 * forced the <CanAccess /> call sites to be commented out.
 *
 * Flip to `false` the moment the API starts returning `effectivePermissions`,
 * and the guards throughout the app become enforcing with no other changes.
 */
const ALLOW_WHEN_PERMISSIONS_UNPROVISIONED = true;

const normalize = (value) => (typeof value === "string" ? value.toLowerCase() : value);

const useCanAccess = (resources = "", actions = [], options = { resourcesMode: "any", actionsMode: "any" }) => {
  const [auth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });

  // Read once into a local so the memo's inferred and declared dependencies match.
  const effectivePermissions = auth?.effectivePermissions;

  const permissionMap = useMemo(() => {
    if (!effectivePermissions?.length) {
      return new Map();
    }

    return new Map(effectivePermissions.map((permission) => [normalize(permission.resource), new Set(permission.actions.map(normalize))]));
  }, [effectivePermissions]);

  if (!permissionMap.size) {
    return ALLOW_WHEN_PERMISSIONS_UNPROVISIONED && !!auth;
  }

  const requiredResources = Array.isArray(resources) ? resources.map(normalize) : [normalize(resources)];
  const requiredActions = Array.isArray(actions) ? actions.map(normalize) : [normalize(actions)];

  const checkActions = (permissionActionsSet) => {
    if (!permissionActionsSet?.size) return false;

    return options.actionsMode === "all" ? requiredActions.every((action) => permissionActionsSet.has(action)) : requiredActions.some((action) => permissionActionsSet.has(action));
  };

  const resourceResults = requiredResources.map((resource) => {
    const permissionActionsSet = permissionMap.get(resource);

    if (!permissionActionsSet) return false;

    return checkActions(permissionActionsSet);
  });

  return options.resourcesMode === "all" ? resourceResults.every(Boolean) : resourceResults.some(Boolean);
};

export default useCanAccess;
