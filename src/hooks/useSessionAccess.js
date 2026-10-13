import { useLocalStorage } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { allAccessQuery, authUserId, findAccessOf, mergeRolePermissions } from "../api/access";

/** What the user's Access record (or its absence) adds to `auth`. */
export const toSessionAccess = (access) => {
  const roles = access?.roles ?? [];

  return {
    // Not `roles`, so the profile's own fields from the login are left alone.
    accessRoles: roles.map(({ _id, title, scope }) => ({ _id, title, scope })),
    effectivePermissions: mergeRolePermissions(roles),
    indexPath: roles.find((role) => role?.indexPath)?.indexPath ?? "/",
    accessError: access ? null : "Your account has not been given access to Asset360 yet. Ask an admin to assign you a role.",
  };
};

/**
 * Fills the session with the signed-in user's Asset360 permissions.
 *
 * The Auth360 login only returns the profile, so the permissions come from the
 * user's Access record (its roles, merged) and are written into `auth` as
 * `effectivePermissions`, where every `useCanAccess` reads them. Anything that
 * goes wrong leaves an empty list (no access) plus `accessError` to explain it.
 */
const useSessionAccess = () => {
  const [auth, setAuth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });

  const userId = authUserId(auth);

  // The same cached `access/all` the Access screen and the sign-in use, narrowed
  // to this user — so it is fetched once, not once per caller.
  const query = useQuery({ ...allAccessQuery(), enabled: !!userId, retry: false, select: (list) => findAccessOf(list, userId) });

  useEffect(() => {
    if (query.isSuccess) {
      setAuth((current) => current && { ...current, ...toSessionAccess(query.data) });
    }

    if (query.isError) {
      setAuth((current) => current && { ...current, effectivePermissions: [], accessError: query.error?.message || "Could not load your access." });
    }
  }, [query.isSuccess, query.isError, query.data, query.error, setAuth]);
};

export default useSessionAccess;
