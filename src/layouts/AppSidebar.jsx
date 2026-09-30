import { ActionIcon, Box, ScrollArea, Stack, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconHexagonLetterA } from "@tabler/icons-react";
import CanAccess from "../components/CanAccess";
import AppSidebarLink from "./AppSidebarLink";
import classes from "./Appsidebar.module.css";
import { NAV_SECTIONS } from "./navigation";

const Guard = ({ permission, children }) =>
  permission ? (
    <CanAccess resource={permission.resource} action={permission.action}>
      {children}
    </CanAccess>
  ) : (
    children
  );

const AppSidebar = ({ collapsed = false, onToggleCollapse }) => (
  <Box className={classes.sidebar} data-collapsed={collapsed || undefined}>
    <div className={classes.glow} aria-hidden="true" />

    {onToggleCollapse && (
      <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} position="right" withArrow>
        <ActionIcon
          visibleFrom="md"
          className={classes.collapseToggle}
          size={26}
          radius="xl"
          variant="default"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
        </ActionIcon>
      </Tooltip>
    )}

    <div className={classes.brand}>
      <span className={classes.brandTile}>
        <IconHexagonLetterA size={21} stroke={1.8} />
      </span>

      {!collapsed && (
        <div className={classes.brandText}>
          <div className={classes.brandName}>Asset360</div>
        </div>
      )}
    </div>

    <ScrollArea className={classes.nav} scrollbarSize={4} type="scroll">
      {NAV_SECTIONS.map((section) => (
        <Box key={section.label}>
          <div className={classes.sectionLabel}>{section.label}</div>

          <Stack gap={3} align={collapsed ? "center" : "stretch"}>
            {section.links.map((link) => (
              <Guard key={link.path} permission={link.permission}>
                <AppSidebarLink link={link} collapsed={collapsed} />
              </Guard>
            ))}
          </Stack>
        </Box>
      ))}
    </ScrollArea>
  </Box>
);

export default AppSidebar;
