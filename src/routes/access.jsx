import { Route } from "react-router-dom";
import Protected from "../components/Protected";
import { AccessPage } from "./lazyPages";

export const accessRoutes = (
  <Route path="access" element={<Protected resource="access" action="read" />}>
    <Route index element={<AccessPage />} />
  </Route>
);
