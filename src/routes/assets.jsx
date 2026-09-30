import { Navigate, Route } from "react-router-dom";
import Protected from "../components/Protected";
import AssetDetails from "../features/assets/AssetDetails";
import AssetsPage from "../pages/AssetsPage";

export const assetRoutes = (
  <Route path="assets" element={<Protected resource="asset" action="read" />}>
    <Route index element={<AssetsPage />} />

    {/* The dashboard used to live under /assets — keep old links working. */}
    <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />

    <Route path=":id" element={<AssetDetails />} />
  </Route>
);
