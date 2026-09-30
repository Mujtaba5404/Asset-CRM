import { Navigate, useParams } from "react-router-dom";

/**
 * Settings moved from /admin-settings to /settings, so old links keep working.
 *
 * The trailing slug is carried across optimistically — the settings screen shows
 * an "unknown setting" state if it no longer exists. Deliberately does not import
 * the picklist registry, which would pull every settings screen into the initial
 * bundle and undo the code split in ./settings.jsx.
 */
const LegacySettingsRedirect = () => {
  const params = useParams();

  const slug = params["*"]?.split("/").filter(Boolean).pop();

  return <Navigate to={slug && slug !== "picklists" ? `/settings/picklists/${slug}` : "/settings/picklists"} replace />;
};

export default LegacySettingsRedirect;
