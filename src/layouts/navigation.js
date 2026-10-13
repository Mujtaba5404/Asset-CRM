import { IconChartHistogram, IconListDetails, IconPackage, IconShieldLock, IconTool, IconTrendingDown } from "@tabler/icons-react";

export const NAV_SECTIONS = [
  {
    label: "Workspace",
    links: [
      { title: "Summary", path: "/summary", icon: IconChartHistogram, permission: { resource: "asset", action: "read" } },
      { title: "Assets", path: "/assets", icon: IconPackage, permission: { resource: "asset", action: "read" } },
      { title: "Depreciations", path: "/depreciations", icon: IconTrendingDown, permission: { resource: "depreciation", action: "read" } },
      { title: "Maintenance", path: "/maintenance", icon: IconTool, permission: { resource: "maintenance", action: "read" } },
    ],
  },
  {
    label: "Configuration",
    links: [
      { title: "Picklists", path: "/settings/picklists", icon: IconListDetails, permission: { resource: "picklist", action: "read" } },
      { title: "Roles", path: "/roles", icon: IconShieldLock, permission: { resource: "role", action: "read" } },
    ],
  },
];

export const HOME_PATH = "/summary";

/** Every sidebar destination, in order — "/" picks the first one a role can read. */
export const ALL_NAV_LINKS = NAV_SECTIONS.flatMap((section) => section.links);
