import { Center, Loader } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconLock } from "@tabler/icons-react";
import { Navigate } from "react-router-dom";
import { usePermissions, usePermissionsLoaded } from "../hooks/useCanAccess";
import { ALL_NAV_LINKS, HOME_PATH } from "../layouts/navigation";
import EmptyState from "./EmptyState";

/**
 * "/" lands on the role's landing page when it can open it, then the summary,
 * then the first screen it can read. A user who can read nothing is told why
 * instead of being sent round in a loop.
 */
const HomeRedirect = () => {
  const [auth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });
  const can = usePermissions();
  const loaded = usePermissionsLoaded();

  const links = ALL_NAV_LINKS.filter((link) => !link.permission || can(link.permission.resource, link.permission.action));
  const landing = auth?.indexPath && auth.indexPath !== "/" ? links.find((link) => auth.indexPath.startsWith(link.path)) : null;
  const home = (landing && auth.indexPath) || links.find((link) => link.path === HOME_PATH)?.path || links[0]?.path;

  if (home) return <Navigate to={home} replace />;

  // Still finding out what this user may open.
  if (!loaded) {
    return (
      <Center h="60vh">
        <Loader />
      </Center>
    );
  }

  return (
    <EmptyState
      title="No access yet"
      description={auth?.accessError || "Your role does not grant any Asset360 screens. Ask an admin to add permissions to it."}
      icon={<IconLock size={26} />}
    />
  );
};

export default HomeRedirect;
