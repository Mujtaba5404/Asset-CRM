import { IconPackage } from "@tabler/icons-react";

import AssetCategories from "./features/AssetCategories";
import AssetConditions from "./features/AssetConditions";
import AssetLocations from "./features/AssetLocations";
import AssetStatus from "./features/AssetStatus";
import AssetSubCategories from "./features/AssetSubCategories";
import DisposalReasons from "./features/DisposalReasons";
import WarrantyProviders from "./features/WarrantyProviders";

/**
 * Every picklist screen in the app, grouped by the module it configures.
 *
 * Single source of truth: routes, the settings navigation and its search all
 * read from here, so adding a list means adding one row (plus its screen under
 * ./features).
 *
 * Scope: only lists that something in the app actually reads. Each entry below
 * backs a field the asset form or the asset filters query — see AssetForm.jsx
 * and assetFilterFields.js.
 */
export const PICKLIST_GROUPS = [
  {
    key: "assets",
    label: "Assets",
    icon: IconPackage,
    description: "Classification, placement and lifecycle options for asset records.",
    items: [
      { slug: "asset-status", label: "Asset status", element: AssetStatus },
      { slug: "asset-categories", label: "Asset categories", element: AssetCategories },
      { slug: "asset-sub-categories", label: "Asset sub categories", element: AssetSubCategories },
      { slug: "asset-locations", label: "Asset locations", element: AssetLocations },
      { slug: "asset-conditions", label: "Asset conditions", element: AssetConditions },
      { slug: "warranty-providers", label: "Warranty providers", element: WarrantyProviders },
      { slug: "disposal-reasons", label: "Disposal reasons", element: DisposalReasons },
    ],
  },
];

/** Flat list of every picklist screen, in navigation order. */
export const PICKLIST_ITEMS = PICKLIST_GROUPS.flatMap((group) => group.items.map((item) => ({ ...item, group })));

/** The screen the picklists section lands on. */
export const DEFAULT_PICKLIST_SLUG = PICKLIST_ITEMS[0].slug;

export const findPicklistItem = (slug) => PICKLIST_ITEMS.find((item) => item.slug === slug);
