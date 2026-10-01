import { IconChartHistogram, IconLayoutDashboard, IconListDetails, IconPackage } from "@tabler/icons-react";

/**
 * Primary navigation — the single source of truth for the sidebar.
 *
 * `permission` is optional; when present the link is wrapped in <CanAccess />.
 * `children` renders a nested group (an inline sublist when the sidebar is
 * expanded, a hover menu when it is collapsed to its icon rail).
 * `count` renders a badge / dot indicator.
 */
export const NAV_SECTIONS = [
  {
    label: "Workspace",
    links: [
      { title: "Dashboard", path: "/dashboard", icon: IconLayoutDashboard },
      { title: "Assets", path: "/assets", icon: IconPackage, permission: { resource: "asset", action: "read" } },
      { title: "Summary", path: "/summary", icon: IconChartHistogram, permission: { resource: "asset", action: "read" } },
    ],
  },
  {
    label: "Configuration",
    links: [{ title: "Picklists", path: "/settings/picklists", icon: IconListDetails, permission: { resource: "picklist", action: "read" } }],
  },
];

export const HOME_PATH = "/dashboard";
