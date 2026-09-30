import { Navigate, Route } from "react-router-dom";
import Protected from "../components/Protected";
import LegacySettingsRedirect from "./LegacySettingsRedirect";
import { PicklistsPage, SettingsPage } from "./lazyPages";

export const settingsRoutes = (
  <Route path="settings" element={<Protected resource="picklist" action="read" />}>
    <Route element={<SettingsPage />}>
      <Route index element={<Navigate to="picklists" replace />} />

      <Route path="picklists">
        {/* The picklists screen redirects to the first list when no slug is present. */}
        <Route index element={<PicklistsPage />} />
        <Route path=":slug" element={<PicklistsPage />} />
      </Route>
    </Route>
  </Route>
);

export const legacySettingsRoutes = <Route path="admin-settings/*" element={<LegacySettingsRedirect />} />;
