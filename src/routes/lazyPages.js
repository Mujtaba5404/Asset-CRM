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

export const RolesPage = lazy(() => import("../pages/RolesPage"));

export const DepreciationsPage = lazy(() => import("../pages/DepreciationsPage"));

export const DepreciationDetails = lazy(() => import("../features/depreciations/DepreciationDetails"));

export const AccessPage = lazy(() => import("../pages/AccessPage"));

export const MaintenancePage =lazy(() => import("../pages/MaintenancePage"));

export const MaintenanceDetails = lazy(() => import("../features/maintenance/MaintenanceDetails"));
