import { Navigate, Route } from "react-router-dom";
import Protected from "../components/Protected";
import AssetDetails from "../features/assets/AssetDetails";
import AssetsPage from "../pages/AssetsPage";
import AssetSummaryPage from "../pages/AssetSummaryPage";

export const assetRoutes = (
  <Route path="assets" element={<Protected resource="asset" action="read" />}>
    <Route index element={<AssetsPage />} />

    {/* The dashboard used to live under /assets — keep old links working. */}
    <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />

    <Route path=":id" element={<AssetDetails />} />
  </Route>
);

/* Its own top-level path rather than /assets/summary, so the sidebar can mark it
   active without also lighting up the assets list. */
export const assetSummaryRoutes = (
  <Route path="summary" element={<Protected resource="asset" action="read" />}>
    <Route index element={<AssetSummaryPage />} />
  </Route>
);
