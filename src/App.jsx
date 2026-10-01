import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Login from "./features/auth/Login";
import AppLayout from "./layouts/AppLayout";
import { HOME_PATH } from "./layouts/navigation";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { assetRoutes, assetSummaryRoutes } from "./routes/assets";
import { legacySettingsRoutes, settingsRoutes } from "./routes/settings";

const App = () => (
  <Routes>
    <Route path="login" element={<Login />} />

    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={HOME_PATH} replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {assetRoutes}
        {assetSummaryRoutes}
        {settingsRoutes}
        {legacySettingsRoutes}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
