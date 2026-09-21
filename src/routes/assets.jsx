import { Route } from "react-router-dom";
import AssetTable from "../features/assets/AssetTable";
import AssetDetails from "../features/assets/AssetDetails";
import AssetsLayout from "../layouts/assets";
import Dashboard from "../pages/Dashboard";

export const assetRoutes = (
  <Route path="assets">
    <Route element={<AssetsLayout />}>
      <Route index element={<AssetTable />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Route>

    <Route path=":id" element={<AssetDetails />} />
  </Route>
);