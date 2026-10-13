import { Route } from "react-router-dom";
import Protected from "../components/Protected";
import { DepreciationDetails, DepreciationsPage } from "./lazyPages";

export const depreciationRoutes = (
  <Route path="depreciations" element={<Protected resource="depreciation" action="read" />}>
    <Route index element={<DepreciationsPage />} />

    <Route path=":id" element={<DepreciationDetails />} />
  </Route>
);
