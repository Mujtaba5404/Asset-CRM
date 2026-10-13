import { Navigate } from "react-router-dom";
import useCanAccess, { usePermissionsLoaded } from "../hooks/useCanAccess";

const DEFAULT_OPTIONS = { resourcesMode: "any", actionsMode: "any" };

/**
 * Renders `children` only when the signed-in user's roles allow `action` on
 * `resource`. With `redirect`, an unauthorised visit is sent to `redirectPath`
 * instead of rendering nothing — but only once the permissions have loaded, so
 * a page opened directly is not bounced away while they are on their way.
 */
const CanAccess = ({ resource = "", action = "", redirect = false, redirectPath = "/", options = DEFAULT_OPTIONS, children }) => {
  const hasAccess = useCanAccess(resource, action, options);
  const loaded = usePermissionsLoaded();

  if (hasAccess) {
    // Fragment-wrapped so multiple children don't trip React's key warning.
    return <>{children}</>;
  }

  return redirect && loaded ? <Navigate to={redirectPath} replace /> : null;
};

export default CanAccess;
