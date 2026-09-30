import { lazy } from "react";

/**
 * Route-level code splitting.
 *
 * The settings area pulls in ~50 picklist screens, so it loads on demand instead
 * of riding along in the initial bundle — which is what mobile actually pays for.
 *
 * Nothing here (or in the route files that use it) may import the picklist
 * registry eagerly, or the split is undone.
 */
export const SettingsPage = lazy(() => import("../pages/Settings"));

export const PicklistsPage = lazy(() => import("../pages/Picklists"));
