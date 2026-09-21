import { Route } from "react-router-dom";
import Picklists from "../pages/Picklists";
import Protected from "../components/Protected";
import AssetStatus from "../features/picklists/features/AssetStatus";
import AssetCategories from "../features/picklists/features/AssetCategories";
import AssetSubCategories from "../features/picklists/features/AssetSubCategories";
import AssetLocations from "../features/picklists/features/AssetLocations";
import AssetConditions from "../features/picklists/features/AssetConditions";
import WarrantyProviders from "../features/picklists/features/WarrantyProviders";
import DisposalReasons from "../features/picklists/features/DisposalReasons";

export const picklistRoutes = (
  <Route
    path="picklists"
    element={
      // <Protected resource="picklist" action="read">
        <Picklists />
      // </Protected>
    }
  >
    <Route index element={<AssetStatus />} />
    <Route path="asset-status" element={<AssetStatus />} />
    <Route path="asset-categories" element={<AssetCategories />} />
    <Route path="asset-sub-categories" element={<AssetSubCategories />} />
    <Route path="asset-locations" element={<AssetLocations />} />
    <Route path="asset-conditions" element={<AssetConditions />} />
    <Route path="warranty-providers" element={<WarrantyProviders />} />
    <Route path="disposal-reasons" element={<DisposalReasons />} />
  </Route>
);
