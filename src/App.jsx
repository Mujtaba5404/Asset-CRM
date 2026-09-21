import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/auth/Login";
import RequireAuth from "./components/RequireAuth";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";
import { adminSettingsRoutes } from "./routes/adminSettings";
import { assetRoutes } from "./routes/assets";

const HOME = "/assets/dashboard";

const App = () => (
  <Routes>
    <Route path="login" element={<Login />} />

    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={HOME} replace />} />
        <Route path="dashboard" element={<Navigate to={HOME} replace />} />
        {assetRoutes}
        {adminSettingsRoutes}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;