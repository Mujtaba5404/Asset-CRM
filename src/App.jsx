import { Navigate, Route, Routes } from "react-router-dom";
import HomeRedirect from "./components/HomeRedirect";
import RequireAuth from "./components/RequireAuth";
import Login from "./features/auth/Login";
import AppLayout from "./layouts/AppLayout";
import { HOME_PATH } from "./layouts/navigation";
import NotFound from "./pages/NotFound";
import { accessRoutes } from "./routes/access";
import { assetRoutes, assetSummaryRoutes } from "./routes/assets";
import { depreciationRoutes } from "./routes/depreciations";
import { maintenanceRoutes } from "./routes/maintenance";
import { roleRoutes } from "./routes/roles";
import { legacySettingsRoutes, settingsRoutes } from "./routes/settings";

const App = () => (
  <Routes>
    <Route path="login" element={<Login />} />

    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        {/* The role's landing page, or the first screen it can read. */}
        <Route index element={<HomeRedirect />} />
        {/* The dashboard was folded into the summary — keep old links working. */}
        <Route path="dashboard" element={<Navigate to={HOME_PATH} replace />} />

        {assetRoutes}
        {assetSummaryRoutes}
        {depreciationRoutes}
        {maintenanceRoutes}
        {roleRoutes}
        {accessRoutes}
        {settingsRoutes}
        {legacySettingsRoutes}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
