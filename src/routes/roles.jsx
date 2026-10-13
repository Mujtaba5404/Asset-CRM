import { Route } from "react-router-dom";
import Protected from "../components/Protected";
import { RolesPage } from "./lazyPages";

export const roleRoutes = (
  <Route path="roles" element={<Protected resource="role" action="read" />}>
    <Route index element={<RolesPage />} />
  </Route>
);
