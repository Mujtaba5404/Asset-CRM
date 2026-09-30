import { Navigate } from "react-router-dom";
import useCanAccess from "../hooks/useCanAccess";

const DEFAULT_OPTIONS = { resourcesMode: "any", actionsMode: "any" };

/**
 * Renders `children` only when the signed-in user may perform `action` on
 * `resource`. With `redirect`, an unauthorised visit is sent to `redirectPath`
 * instead of rendering nothing.
 */
const CanAccess = ({ resource = "", action = "", redirect = false, redirectPath = "/404", options = DEFAULT_OPTIONS, children }) => {
  const hasAccess = useCanAccess(resource, action, options);

  if (hasAccess) {
    // Fragment-wrapped so multiple children don't trip React's key warning.
    return <>{children}</>;
  }

  return redirect ? <Navigate to={redirectPath} replace /> : null;
};

export default CanAccess;
