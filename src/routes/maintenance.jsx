import { Route } from "react-router-dom";
import Protected from "../components/Protected";
import { MaintenanceDetails, MaintenancePage } from "./lazyPages";

export const maintenanceRoutes = (
  <Route path="maintenance" element={<Protected resource="maintenance" action="read" />}>
    <Route index element={<MaintenancePage />} />

    <Route path=":id" element={<MaintenanceDetails />} />
  </Route>
);
